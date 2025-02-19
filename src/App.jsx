import React, { useEffect, useState, useRef } from "react";
import ChatSelector from "./components/model.jsx";
import ollama from "ollama";

const saveChatToLocalStorage = (chat) => {
	const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
	existingChats.push(chat);
	localStorage.setItem("chats", JSON.stringify(existingChats));
};

function App() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [abortController, setAbortController] = useState(null);
	const [chat, setChat] = useState("qwen2.5:1.5b");

	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	const handleSubmit = async (e) => {
		e && e.preventDefault();
		if (!prompt.trim()) return;

		const currentPrompt = prompt;
		const newUserMessage = { role: "user", content: currentPrompt };
		const conversationToSend = [...messages, newUserMessage];

		setIsLoading(true);
		setMessages(conversationToSend);
		setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
		setPrompt("");

		const controller = new AbortController();
		setAbortController(controller);

		let assistantMessage = "";
		try {
			const response = await ollama.chat({
				model: chat,
				messages: conversationToSend,
				stream: true,
				options: {
					signal: controller.signal,
				},
			});

			for await (const part of response) {
				assistantMessage += part.message?.content || "";
				setMessages((prev) => {
					const last = prev[prev.length - 1];
					if (last?.role === "assistant") {
						return [
							...prev.slice(0, -1),
							{ ...last, content: assistantMessage },
						];
					}
					return prev;
				});
			}
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Error:", error);
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: `Error: ${error.message}` },
				]);
			}
		} finally {
			setIsLoading(false);
			setAbortController(null);
			const chatId = new Date().toISOString();
			saveChatToLocalStorage({
				id: chatId,
				heading: currentPrompt,
				messages: [
					...conversationToSend,
					{ role: "assistant", content: assistantMessage },
				],
			});
		}
	};

	const handleCancelStream = () => {
		if (abortController) {
			abortController.abort();
			setAbortController(null);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "c") {
				handleCancelStream();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [abortController]);

	return (
		<div className="flex flex-col flex-1 gap-2">
			<div className="overflow-hidden top-0 flex-1 mb-36">
				<ChatSelector chat={chat} setChat={setChat} />

				<div className="flex flex-col p-4 min-w-[700px] border border-gray-200 mx-auto rounded-xl w-[50%] bg-white h-full">
					<div
						ref={chatContainerRef}
						className="overflow-y-auto flex-1 pr-2 space-y-4"
					>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`flex ${
									message.role === "user"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-xl px-3 py-2 ${
										message.role === "user"
											? "bg-blue-100/50 text-gray-900"
											: "text-gray-900"
									}`}
								>
									<p className="whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="left-1/2 transform bg-gray-50 -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
				<form onSubmit={handleSubmit} className="flex flex-col">
					<textarea
						ref={textareaRef}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSubmit();
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
		</div>
	);
}

export default App;
