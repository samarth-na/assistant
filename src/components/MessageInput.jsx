import React, { useRef, useState } from "react";

const MessageInput = ({ onSubmit, isLoading, handleCancelStream }) => {
	const [prompt, setPrompt] = useState("");
	const textareaRef = useRef(null);

	const handleFormSubmit = (e) => {
		e && e.preventDefault();
		if (!prompt.trim()) return;

		onSubmit(prompt);
		setPrompt("");
	};

	return (
		<div className="left-1/2 transform bg-gray-50 -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
			<form onSubmit={handleFormSubmit} className="flex flex-col">
				<textarea
					ref={textareaRef}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							handleFormSubmit();
						}
					}}
					placeholder="Type message"
					rows="3"
					className="flex-1 p-2 px-3 mb-2 rounded-xl border border-gray-200"
				/>
				<button
					type={isLoading ? "button" : "submit"}
					onClick={handleCancelStream}
					disabled={false}
					className={`mb-2 text-sm text-gray-500 rounded-lg cursor-pointer hover:text-gray-800 ${
						isLoading ? "text-red-400 hover:text-red-500" : ""
					}`}
				>
					{isLoading
						? "Ctrl-C or click to cancel message"
						: "Ctrl 󰌑 or click to send message"}
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
