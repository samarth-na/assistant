import React from "react";

interface HeaderProps {
  currentModel: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentModel,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar,
  sidebarOpen,
  isMobile = false,
}) => {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 h-12">
      {/* Left: Menu button (visible when sidebar is closed or on mobile) */}
      {(!sidebarOpen || isMobile) && (
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            cursor-pointer transition-colors duration-150 rounded flex-shrink-0"
          title="Toggle sidebar"
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      )}

      {/* Center: Model selector */}
      <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150 flex-shrink-0">
        <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">
          {currentModel || "Select model"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 text-gray-400 flex-shrink-0"
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

      {/* Right: Theme toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            cursor-pointer transition-colors duration-150 rounded"
          title="Toggle theme"
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
        </button>
      </div>
    </div>
  );
};

export default Header;
