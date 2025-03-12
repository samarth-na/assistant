import React, {
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";

import ChatSelector from "./components/model.jsx";
import ollama from "ollama";

// Reducer for managing messages more efficiently
const messagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];
    case "UPDATE_LAST_MESSAGE":
      return state.map((msg, index) =>
        index === state.length - 1 ? { ...msg, content: action.payload } : msg
      );
    default:
      return state;
  }
};

const saveChatToLocalStorage = (chat) => {
  const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
  existingChats.push(chat);
  localStorage.setItem("chats", JSON.stringify(existingChats));
};

const MemoizedChatSelector = React.memo(ChatSelector);

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState("qwen2.5:1.5b");
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const abortControllerRef = useRef(null);

  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!prompt.trim()) return;

      const currentPrompt = prompt;
      const newUserMessage = { role: "user", content: currentPrompt };
      const conversationToSend = [...messages, newUserMessage];

      setIsLoading(true);
      dispatchMessages({ type: "ADD_MESSAGE", payload: newUserMessage });
      dispatchMessages({
        type: "ADD_MESSAGE",
        payload: { role: "assistant", content: "" },
      });
      setPrompt("");

      abortControllerRef.current = new AbortController();

      let assistantMessage = "";
      try {
        const response = await ollama.chat({
          model: chat,
          messages: conversationToSend,
          stream: true,
          signal: abortControllerRef.current.signal,
        });

        for await (const part of response) {
          assistantMessage += part.message?.content || "";
          dispatchMessages({
            type: "UPDATE_LAST_MESSAGE",
            payload: assistantMessage,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error:", error);
          dispatchMessages({
            type: "ADD_MESSAGE",
            payload: {
              role: "assistant",
              content: `Error: ${error.message}`,
            },
          });
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
        saveChatToLocalStorage({
          id: new Date().toISOString(),
          heading: currentPrompt,
          messages: [
            ...conversationToSend,
            { role: "assistant", content: assistantMessage },
          ],
        });
      }
    },
    [messages, chat, prompt]
  );

  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        handleCancelStream();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    chatContainerRef.current?.scrollTo(
      0,
      chatContainerRef.current.scrollHeight
    );
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="overflow-hidden top-0 flex-1 mb-36">
        <MemoizedChatSelector chat={chat} setChat={setChat} />

        <div className="flex flex-col p-4 min-w-[700px] border border-gray-200 mx-auto rounded-xl w-[50%] bg-white h-full">
          <div
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 pr-2 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 ${message.role === "user" ? "bg-blue-100/50 text-gray-900" : "text-gray-900"}`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="left-1/2 transform bg-gray-50 -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type message"
            rows="3"
            className="flex-1 p-2 px-3 mb-2 rounded-xl border border-gray-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleCancelStream}
            className={`mb-2 text-sm text-gray-500 rounded-lg cursor-pointer hover:text-gray-800 ${isLoading ? "text-red-400 hover:text-red-500" : ""}`}
          >
            {isLoading
              ? "Ctrl-C or click to cancel message"
              : "Ctrl 󰌑 or click to send message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
