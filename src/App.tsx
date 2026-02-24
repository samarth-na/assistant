import {
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
  useLayoutEffect,
  FormEvent,
  KeyboardEvent,
} from "react";

import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import ollama from "ollama/browser";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  heading: string;
  messages: Message[];
}

type MessagesAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_LAST_MESSAGE"; payload: string }
  | { type: "SET_MESSAGES"; payload: Message[] };

const loadChats = (): Chat[] => {
  try {
    const stored = localStorage.getItem("chats");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveChat = (chatObj: Chat): Chat[] => {
  const chats = loadChats();
  const idx = chats.findIndex((c) => c.id === chatObj.id);
  if (idx !== -1) chats[idx] = chatObj;
  else chats.unshift(chatObj);
  localStorage.setItem("chats", JSON.stringify(chats));
  return chats;
};

const deleteChat = (id: string): Chat[] => {
  const chats = loadChats().filter((c) => c.id !== id);
  localStorage.setItem("chats", JSON.stringify(chats));
  return chats;
};

const messagesReducer = (
  state: Message[],
  action: MessagesAction
): Message[] => {
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

const newId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const abortRef = useRef<AbortController | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState(newId);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setChatHistory(loadChats());
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveChatId(newId());
    dispatch({ type: "SET_MESSAGES", payload: [] });
    setPrompt("");
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    const found = loadChats().find((c) => c.id === id);
    if (found) {
      setActiveChatId(found.id);
      dispatch({ type: "SET_MESSAGES", payload: found.messages });
    }
  }, []);

  const handleDeleteChat = useCallback(
    (id: string) => {
      const updated = deleteChat(id);
      setChatHistory(updated);
      if (activeChatId === id) handleNewChat();
    },
    [activeChatId, handleNewChat]
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim() || !chat) return;

      const currentPrompt = prompt;
      const userMsg: Message = { role: "user", content: currentPrompt };
      const conversation: Message[] = [...messages, userMsg];

      setIsLoading(true);
      dispatch({ type: "ADD_MESSAGE", payload: userMsg });
      dispatch({
        type: "ADD_MESSAGE",
        payload: { role: "assistant", content: "" },
      });
      setPrompt("");

      const controller = new AbortController();
      abortRef.current = controller;

      let assistantText = "";
      try {
        const response = await ollama.chat({
          model: chat,
          messages: conversation,
          stream: true,
        });

        for await (const part of response) {
          if (controller.signal.aborted) break;
          assistantText += part.message?.content || "";
          dispatch({ type: "UPDATE_LAST_MESSAGE", payload: assistantText });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
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
    [messages, chat, activeChatId]
  );

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e: Event) => {
      const ke = e as unknown as KeyboardEvent;
      if ((ke.ctrlKey || ke.metaKey) && ke.key === "c" && isLoading) {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLoading]);

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex bg-white dark:bg-dark-bg overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentModel={chat}
        onSelectModel={(model) => {
          setChat(model);
        }}
        isMobile={isMobile}
      />

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <Header
          currentModel={chat}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            chatRef={chatRef}
          />
          <ChatInput
            prompt={prompt}
            isLoading={isLoading}
            textareaRef={textareaRef}
            onSubmit={handleSubmit}
            onChange={setPrompt}
            onKeyDown={handleKeyDown}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
