import React from "react";
import Markdown from "./Markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  chatRef: React.RefObject<HTMLDivElement | null>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  chatRef,
}) => {
  return (
    <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[40vh]">
            <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              What are you working on?
            </h1>
          </div>
        )}

        {messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5
                ${
                  message.role === "user"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : "text-gray-800 dark:text-gray-200"
                }`}
            >
              {message.role === "user" ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                <div className="text-sm leading-relaxed">
                  <Markdown content={message.content} />
                  {index === messages.length - 1 && isLoading && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-teal-500 animate-pulse align-middle" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;
