import React, {
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";

import ChatSelector from "./components/model.jsx";
import Sidebar from "./components/sidebar.jsx";
import Markdown from "./components/Markdown.jsx";
import ollama from "ollama/browser";

// --- localStorage ---

const loadChats = () => {
  try {
    return JSON.parse(localStorage.getItem("chats")) || [];
  } catch {
    return [];
  }
};

const saveChat = (chatObj) => {
  const chats = loadChats();
  const idx = chats.findIndex((c) => c.id === chatObj.id);
  if (idx !== -1) chats[idx] = chatObj;
  else chats.unshift(chatObj);
  localStorage.setItem("chats", JSON.stringify(chats));
  return chats;
};

const deleteChat = (id) => {
  const chats = loadChats().filter((c) => c.id !== id);
  localStorage.setItem("chats", JSON.stringify(chats));
  return chats;
};

// --- Reducer ---

const messagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];
    case "UPDATE_LAST_MESSAGE":
      return state.map((msg, i) =>
        i === state.length - 1 ? { ...msg, content: action.payload } : msg
      );
    case "SET_MESSAGES":
      return action.payload;
    default:
      return state;
  }
};

const newId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const MemoizedChatSelector = React.memo(ChatSelector);

// --- App ---

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState("qwen2.5:1.5b");
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const abortRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(newId);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const textareaRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setChatHistory(loadChats());
  }, []);

  // --- Actions ---

  const handleNewChat = useCallback(() => {
    setActiveChatId(newId());
    dispatch({ type: "SET_MESSAGES", payload: [] });
    setPrompt("");
  }, []);

  const handleSelectChat = useCallback((id) => {
    const found = loadChats().find((c) => c.id === id);
    if (found) {
      setActiveChatId(found.id);
      dispatch({ type: "SET_MESSAGES", payload: found.messages });
    }
  }, []);

  const handleDeleteChat = useCallback(
    (id) => {
      const updated = deleteChat(id);
      setChatHistory(updated);
      if (activeChatId === id) handleNewChat();
    },
    [activeChatId, handleNewChat]
  );

  // --- Submit ---

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!prompt.trim()) return;

      const currentPrompt = prompt;
      const userMsg = { role: "user", content: currentPrompt };
      const conversation = [...messages, userMsg];

      setIsLoading(true);
      dispatch({ type: "ADD_MESSAGE", payload: userMsg });
      dispatch({
        type: "ADD_MESSAGE",
        payload: { role: "assistant", content: "" },
      });
      setPrompt("");

      abortRef.current = new AbortController();

      let assistantText = "";
      try {
        const response = await ollama.chat({
          model: chat,
          messages: conversation,
          stream: true,
          signal: abortRef.current.signal,
        });

        for await (const part of response) {
          assistantText += part.message?.content || "";
          dispatch({ type: "UPDATE_LAST_MESSAGE", payload: assistantText });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error:", error);
          dispatch({
            type: "UPDATE_LAST_MESSAGE",
            payload: `Error: ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;

        const heading =
          messages.find((m) => m.role === "user")?.content || currentPrompt;
        const updated = saveChat({
          id: activeChatId,
          heading,
          messages: [
            ...conversation,
            { role: "assistant", content: assistantText },
          ],
        });
        setChatHistory(updated);
      }
    },
    [messages, chat, prompt, activeChatId]
  );

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && isLoading) {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLoading]);

  useLayoutEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-full flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-5 h-12 border-b border-slate-300 dark:border-transparent">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors duration-150"
            title="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <MemoizedChatSelector chat={chat} setChat={setChat} />

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="ml-auto pl-4 border-l border-slate-200 dark:border-transparent
              font-mono text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
              cursor-pointer transition-colors duration-150 flex items-center gap-1.5"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
            {darkMode ? "light" : "dark"}
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-0 flex justify-center px-4">
          <div className="flex flex-col w-full max-w-4xl h-full border-1 border-slate-300 dark:border-transparent border-t-0 border-b-0 -b-lg overflow-hidden bg-white dark:bg-slate-900 mb-[-2px]">
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-5 py-6 space-y-5"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="font-serif text-sm text-slate-400 italic">
                    Start a conversation.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded px-3 py-1.5 border
                      ${
                        message.role === "user"
                          ? "bg-tropical-100 border-none text-slate-800 dark:bg-slate-800 dark:border-transparent dark:text-slate-200"
                          : "bg-blue-100 border-none text-slate-700 dark:bg-blue-950 dark:border-transparent dark:text-slate-200"
                      }`}
                  >
                    {message.role === "user" ? (
                      <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <>
                        <Markdown content={message.content} />
                        {index === messages.length - 1 && isLoading && (
                          <span className="inline-block w-1 h-3.5 ml-0.5 bg-teal-400 animate-pulse align-text-bottom" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-slate-300 dark:border-transparent">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Type a message..."
                  rows="3"
                  className="px-4 py-2.5 border border-slate-300 dark:border-transparent rounded bg-white dark:bg-slate-800
                    text-slate-800 dark:text-slate-100 placeholder-slate-400
                    focus:border-slate-400 dark:focus:border-transparent
                    transition-colors duration-150"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400">
                    shift+enter for new line
                  </span>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-3 py-1 font-mono text-xs text-red-400 border border-red-200 dark:border-transparent
                          rounded hover:text-red-500 hover:border-red-300 dark:hover:border-transparent
                          transition-colors duration-150 cursor-pointer"
                      >
                        cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                      className={`px-4 py-1 font-mono text-black rounded
                        transition-colors duration-150 cursor-pointer
                        ${
                          isLoading || !prompt.trim()
                            ? "text-slate-300 dark:text-slate-600 border border-slate-300 dark:border-transparent cursor-not-allowed"
                            : "text-teal-700 dark:text-teal-300 bg-tropical-50 dark:bg-teal-900 border border-teal-300 dark:border-transparent hover:bg-tropical-100 dark:hover:bg-teal-800 hover:border-teal-400 dark:hover:border-transparent"
                        }`}
                    >
                      send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
