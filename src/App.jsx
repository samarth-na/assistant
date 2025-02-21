import React, { useEffect, useState, useRef } from "react";

const saveChatToLocalStorage = (chat) => {
	const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
	existingChats.push(chat);
	localStorage.setItem("chats", JSON.stringify(existingChats));
};

function App() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [streamReader, setStreamReader] = useState(null);
	const [chat, setChat] = useState("qwen2.5:1.5b");

	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	const handleOutputStream = async (reader) => {
		const decoder = new TextDecoder("utf-8");
		let buffer = "";
		let assistantMessage = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");

			for (let i = 0; i < lines.length - 1; i++) {
				const line = lines[i].trim();
				if (!line) continue;

				try {
					const parsed = JSON.parse(line);
					// For the chat endpoint, the streaming token is in parsed.message.content
					assistantMessage += parsed.message.content;
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
					if (parsed.done) {
						reader.cancel();
						break;
					}
				} catch (err) {
					console.error("JSON parse error:", line, err);
				}
			}
			buffer = lines[lines.length - 1];
		}
	};

	const handleSubmit = async (e) => {
		e && e.preventDefault();
		if (!prompt.trim()) return;

		const currentPrompt = prompt;
		const newUserMessage = { role: "user", content: currentPrompt };
		const conversationToSend = [...messages, newUserMessage];

		// Update UI: add the user message...
		setIsLoading(true);
		setMessages(conversationToSend); // ...and add an assistant placeholder (not sent to the API)
		setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
		setPrompt("");

		let assistantMessage = "";
		try {
			const res = await fetch("http://localhost:11434/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// IMPORTANT: the request body now includes the "messages" array that ends with a user message.
				body: JSON.stringify({
					model: chat,
					messages: conversationToSend,
				}),
			});

			if (!res.ok)
				throw new Error(
					`Server error: ${res.status} ${res.statusText}`
				);
			if (!res.body)
				throw new Error("Streaming not supported or no body returned.");
			const reader = res.body.getReader();
			setStreamReader(reader);
			await handleOutputStream(reader);
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: `Error: ${error.message}` },
			]);
		} finally {
			setIsLoading(false);
			const chatId = new Date().toISOString();
			// Save the chat with the full conversation:
			const chatObject = {
				id: chatId,
				heading: currentPrompt,
				// Here we save the conversation including the streaming assistant message
				messages: [
					...conversationToSend,
					{ role: "assistant", content: assistantMessage },
				],
			};
			saveChatToLocalStorage(chatObject);
		}
	};

	const handleCancelStream = () => {
		if (streamReader) {
			streamReader.cancel();
			setStreamReader(null);
		}
		setIsLoading(false);
	};

	const changeChat = (e) => {
		e.preventDefault();
		setChat(e.target.textContent);
	};
	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "c") {
				handleCancelStream();
			}
		};
		document.addEventListener("keydown", handleKeyDown); // Add global event listener
		return () => {
			document.removeEventListener("keydown", handleKeyDown); // Cleanup on unmount
		};
	}, [handleCancelStream]);

	// useEffect(() => {
	// 	if (dummyRef.current) {
	// 		dummyRef.current.scrollIntoView({ behavior: "smooth" });
	// 	}
	// }, [messages]);

	// Refactored chat buttons to remove repetition
	const chatOptions = [
		{ model: "qwen2.5-coder:1.5b" },
		{ model: "deepscaler:latest" },
		{ model: "llama3.2:1b" },
		{ model: "deepseek-r1:1.5b" },
		{ model: "qwen2.5:1.5b" },
	];

	const chatMap = new Map([
		["qwen2.5-coder:1.5b", "qwen2.5-coder"],
		["deepscaler:latest", "deepscaler"],
		["llama3.2:1b", "llama3.2"],
		["deepseek-r1:1.5b", "deepseek-r1"],
		["qwen2.5:1.5b", "qwen2.5"],
	]);
	console.log(chatMap);

	return (
		<div className="flex flex-col flex-1 gap-2">
			<div className="overflow-hidden top-0 flex-1 mb-36">
				<div className="flex flex-row gap-4 justify-center mt-2 mb-2">
					{chatOptions.map(({ model }) => (
						<button
							key={model}
							onClick={changeChat}
							className={` p-2 px-4 text-gray-900 bg-gray-50 cursor-pointer rounded-xl hover:bg-gray-200 ${
								chat === model ? "bg-gray-200" : ""
							}`}
						>
							{model}
						</button>
					))}
				</div>
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
