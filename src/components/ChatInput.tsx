import React, { FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  prompt: string;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: (e?: FormEvent) => void;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onCancel: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  prompt,
  isLoading,
  textareaRef,
  onSubmit,
  onChange,
  onKeyDown,
  onCancel,
}) => {
  return (
    <div className="px-4 py-3">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="pill-input flex items-center gap-2">
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              rounded transition-colors duration-150"
            title="Attach file"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="How can I help you today?"
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200
              placeholder-gray-400 focus:outline-none resize-none
              max-h-32 overflow-y-auto"
            style={{ minHeight: "20px" }}
          />

          <div className="flex items-center gap-1">
            {isLoading && (
              <button
                type="button"
                onClick={onCancel}
                className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded
                  transition-colors duration-150"
              >
                cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`w-7 h-7 rounded-full flex items-center justify-center
                transition-all duration-150
                ${
                  isLoading || !prompt.trim()
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
