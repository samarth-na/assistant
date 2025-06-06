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
    <div className="flex flex-row gap-4 justify-center mt-2 mb-2">
      {chatOptions.map(({ model, name }) => (
        <button
          key={model}
          onClick={() => setChat(model)}
          className={` p-2 px-4 text-gray-900 bg-gray-50 cursor-pointer rounded-xl hover:bg-gray-200 ${
            chat === model ? "bg-gray-200" : ""
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default ChatSelector;
