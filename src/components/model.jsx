import React from "react";

const ChatSelector = ({ chat, setChat }) => {
  const chatOptions = [
    { model: "llama3.2:1b", name: "llama1B" },
    { model: "llama3.2:3b", name: "llama3B" },
    { model: "qwen2.5:1.5b", name: "qwen1B" },
    { model: "qwen2.5:3b", name: "qwen3B" },
    { model: "qwen2.5-coder:1.5b", name: "qwen-coder" },
    {
      model: "erwan2/DeepSeek-R1-Distill-Qwen-1.5B:latest",
      name: "qwen1.5B distilled",
    },
    { model: "deepscaler:latest", name: "deepscaler" },
    { model: "deepseek-r1:1.5b", name: "deepseek" },
  ];

  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {chatOptions.map(({ model, name }) => (
        <button
          key={model}
          onClick={() => setChat(model)}
          className={`px-3.5 py-1.5 font-mono text-sm rounded cursor-pointer
            transition-colors duration-150
            ${
              chat === model
                ? "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700"
                : "text-slate-500 dark:text-slate-400 border border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-200 dark:hover:border-slate-600"
            }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default ChatSelector;
