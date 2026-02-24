import React from "react";

interface ConnectScreenProps {
  onConnect: () => void;
  isConnecting: boolean;
  error?: string | null;
}

const ConnectScreen: React.FC<ConnectScreenProps> = ({
  onConnect,
  isConnecting,
  error,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2">
          Welcome to Assistant
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Connect to Ollama to start chatting
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={onConnect}
          disabled={isConnecting}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg
            transition-all duration-150 cursor-pointer
            ${
              isConnecting
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg"
            }`}
        >
          {isConnecting ? "Connecting..." : "Connect to Ollama"}
        </button>

        {error && (
          <div className="mt-6">
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
            >
              Install Ollama
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectScreen;
