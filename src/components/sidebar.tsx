import React, { useEffect, useState } from "react";

interface ChatItem {
  id: string;
  heading: string;
  messages: Array<{ role: string; content: string }>;
}

interface Model {
  name: string;
  model: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatItem[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  currentModel: string;
  onSelectModel: (model: string) => void;
  isMobile?: boolean;
}

interface ChatGroup {
  label: string;
  chats: ChatItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  chatHistory,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  currentModel,
  onSelectModel,
  isMobile = false,
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [showModels, setShowModels] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:11434/api/tags");
        if (response.ok) {
          const data = await response.json();
          setModels(data.models || []);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };
    fetchModels();
  }, []);

  const groupChatsByDate = (chats: ChatItem[]): ChatGroup[] => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const groups: ChatGroup[] = [];

    const yesterdayChats = chats.filter((c) => {
      const chatDate = parseInt(c.id.split("_")[0] || "0", 36);
      return now - chatDate < oneDay;
    });

    const weekChats = chats.filter((c) => {
      const chatDate = parseInt(c.id.split("_")[0] || "0", 36);
      return now - chatDate >= oneDay && now - chatDate < 7 * oneDay;
    });

    const olderChats = chats.filter((c) => {
      const chatDate = parseInt(c.id.split("_")[0] || "0", 36);
      return now - chatDate >= 7 * oneDay;
    });

    if (yesterdayChats.length > 0) {
      groups.push({ label: "Yesterday", chats: yesterdayChats });
    }
    if (weekChats.length > 0) {
      groups.push({ label: "Previous 7 days", chats: weekChats });
    }
    if (olderChats.length > 0) {
      groups.push({ label: "Older", chats: olderChats });
    }

    return groups;
  };

  const groupedChats = groupChatsByDate(chatHistory);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      <div
        className={`
          h-full bg-gray-50 dark:bg-dark-sidebar flex flex-col overflow-hidden
          border-r border-gray-200 dark:border-gray-800
          ${
            isMobile
              ? "fixed top-0 left-0 z-50 w-64 shadow-2xl lg:hidden"
              : "w-64 shrink-0 lg:relative"
          }
        `}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-3 h-12">
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            cursor-pointer transition-colors duration-150 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2
            text-sm text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors duration-150 cursor-pointer"
          >
            New Chat
          </button>
        </div>

        {/* Search Chats - removed icon */}
        <div className="px-3 py-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800
          rounded border border-gray-200 dark:border-gray-700"
          >
            <input
              type="text"
              placeholder="Search Chats"
              className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300
              placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Community Link - removed icon */}
        <div className="px-3 py-1">
          <button className="sidebar-item w-full">Community</button>
        </div>

        {/* Projects Section */}
        <div className="px-3 py-3 mt-1">
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-400 dark:text-gray-500">
            <span>Projects</span>
            <span className="text-lg leading-none">+</span>
          </div>
        </div>

        {/* Model Selector Section */}
        <div className="px-3 py-1">
          <button
            onClick={() => setShowModels(!showModels)}
            className="sidebar-item w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Models</span>
            </div>
            <svg
              className={`w-3 h-3 transition-transform duration-150 ${showModels ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {showModels && (
            <div className="mt-1 ml-4 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
              {models.length > 0 ? (
                models.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => {
                      onSelectModel(model.name);
                      setShowModels(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded cursor-pointer text-sm
                    transition-colors duration-150
                    ${
                      currentModel === model.name
                        ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {model.name}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-2 italic">
                  No models available
                </p>
              )}
            </div>
          )}
        </div>

        {/* All Chats Section */}
        <div className="px-3 py-2 mt-2">
          <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
            <span>All chats</span>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
          {groupedChats.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-8 italic">
              No chats yet. Start a new conversation!
            </p>
          ) : (
            groupedChats.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.chats.map((chatItem) => (
                    <div
                      key={chatItem.id}
                      className={`group flex items-center rounded cursor-pointer
                      transition-colors duration-150
                      ${
                        activeChatId === chatItem.id
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <button
                        onClick={() => onSelectChat(chatItem.id)}
                        className="flex-1 text-left px-2 py-1.5 min-w-0 cursor-pointer"
                      >
                        <p
                          className={`text-sm truncate ${
                            activeChatId === chatItem.id
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {chatItem.heading}
                        </p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chatItem.id);
                        }}
                        className="p-1 mr-1 opacity-0 group-hover:opacity-100
                        text-gray-400 hover:text-red-500
                        transition-all duration-150 cursor-pointer rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
