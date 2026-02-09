import React from "react";

const Sidebar = ({
  isOpen,
  onToggle,
  chatHistory,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="w-64 shrink-0 h-full border-r border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900
        flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-serif text-base text-slate-800 dark:text-slate-100 tracking-tight">
          History
        </h2>
        <button
          onClick={onToggle}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors duration-150"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2
            font-mono text-sm text-slate-600 dark:text-slate-300
            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded
            hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-700 dark:hover:text-teal-300
            transition-colors duration-150 cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          new chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {chatHistory.length === 0 && (
          <p className="font-serif text-xs text-slate-400 text-center mt-8 px-4 italic">
            No chats yet.
          </p>
        )}
        {chatHistory.map((chatItem) => (
          <div
            key={chatItem.id}
            className={`group flex items-center rounded cursor-pointer
              transition-colors duration-150 border
              ${
                activeChatId === chatItem.id
                  ? "bg-teal-50 dark:bg-teal-900 border-teal-300 dark:border-teal-700"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent"
              }`}
          >
            <button
              onClick={() => onSelectChat(chatItem.id)}
              className="flex-1 text-left px-3 py-2 min-w-0 cursor-pointer"
            >
              <p
                className={`font-serif text-sm truncate ${
                  activeChatId === chatItem.id
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {chatItem.heading}
              </p>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {chatItem.messages.length} msgs
              </p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chatItem.id);
              }}
              className="p-1 mr-2 opacity-0 group-hover:opacity-100
                text-slate-300 dark:text-slate-500 hover:text-red-400
                transition-all duration-150 cursor-pointer"
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
  );
};

export default Sidebar;
