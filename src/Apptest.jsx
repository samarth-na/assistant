import React, { useState, useEffect, useRef } from "react";

const saveChatToLocalStorage = (chat) => {
	const existingChats = JSON.parse(localStorage.getItem("chats")) || [];
	existingChats.push(chat);
	localStorage.setItem("chats", JSON.stringify(existingChats));
};

function App() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [chat, setChat] = useState("qwen2.5:1.5b");
	const textareaRef = useRef(null);
	const chatContainerRef = useRef(null);

	// Store Reader in state so we can cancel the stream
	const [streamReader, setStreamReader] = useState(null);

	// Handle streaming response from Ollama
	const handleOutputStream = async (reader) => {
		const decoder = new TextDecoder("utf-8");
		let buffer = "";
		let botMessage = "";

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
					botMessage += parsed.response;
					setMessages((prev) => {
						const lastMessage = prev[prev.length - 1];
						if (lastMessage.role === "bot") {
							return [
								...prev.slice(0, -1),
								{ ...lastMessage, content: botMessage },
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
		if (e) e.preventDefault();
		if (!prompt.trim()) return;

		setIsLoading(true);

		// Build the updated conversation history with the new user message.
		// This array ends with the user message.
		const updatedMessages = [
			...messages,
			{ role: "user", content: prompt },
		];

		// Update the state to include the new user message.
		setMessages(updatedMessages);

		// Save the current user prompt for later use (e.g., for the chat heading).
		const userPrompt = prompt;

		// Clear the input field.
		setPrompt("");

		try {
			// Send the conversation history as the messages array.
			const res = await fetch("http://localhost:11434/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: chat, // e.g., "llama3.2"
					messages: updatedMessages, // The conversation history ending with the user's message
					stream: true, // Enable streaming if supported
				}),
			});

			if (!res.ok)
				throw new Error(
					`Server error: ${res.status} ${res.statusText}`
				);
			if (!res.body)
				throw new Error("Streaming not supported or no body returned.");

			// Append a placeholder for the assistant's response.
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "" },
			]);
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = "";

			// Process the streamed response and update the assistant's message.
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value);
				assistantMessage += chunk;

				// Update the last message (assistant's placeholder) with the current content.
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1] = {
						role: "assistant",
						content: assistantMessage,
					};
					return updated;
				});
			}
		} catch (error) {
			console.error("Error:", error);
			// If there is an error, append an error message as the assistant's response.
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: `Error: ${error.message}` },
			]);
		} finally {
			setIsLoading(false);
			const chatId = new Date().toISOString();
			const chatObject = {
				id: chatId,
				heading: userPrompt,
				// Save the conversation history without the assistant placeholder (if desired)
				messages: [...updatedMessages],
			};
			saveChatToLocalStorage(chatObject);
		}
	};

	// Cancel function
	const handleCancelStream = () => {
		if (streamReader) {
			streamReader.cancel();
			setStreamReader(null);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		const textarea = textareaRef.current;
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault();
				handleSubmit();
			}
		};

		textarea.addEventListener("keydown", handleKeyDown);
		return () => textarea.removeEventListener("keydown", handleKeyDown);
	}, [handleSubmit]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const onChatChange = (e) => {
		e.preventDefault();
		setChat(e.target.textContent);
	};

	useEffect(() => {
		console.log(chat);
	}, [chat]);

	return (
		<div className="flex flex-col flex-1 gap-2">
			{/* main wrapper*/}
			<div className="overflow-hidden top-0 flex-1 mb-36">
				<div className="flex flex-col p-4 min-w-[700px] border border-gray-200 mx-auto rounded-b-xl w-[50%] bg-white h-full">
					<div className="flex flex-row gap-2 justify-center">
						<button
							onClick={onChatChange} // Corrected to onClick
							className={`" p-2 px-4 text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200" ${chat === "llama3.2:1b" ? "bg-gray-300" : " "}`}
						>
							llama3.2:1b
						</button>
						<button
							onClick={onChatChange} // Corrected to onClick
							className={`" px-4 text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200" ${chat === "deepseek-r1:1.5b" ? "bg-gray-300" : " "}`}
						>
							deepseek-r1:1.5b
						</button>
						<button
							onClick={onChatChange} // Corrected to onClick
							className={`" px-4 text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200" ${chat === "qwen2.5:1.5b" ? "bg-gray-300" : " "}`}
						>
							qwen2.5:1.5b
						</button>
					</div>
					{/* Chat Messages */}
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
									className={`max-w-[80%] rounded-xl px-3 py-2  ${
										message.role === "user"
											? "bg-blue-100/50 text-gray-900"
											: " text-gray-900"
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
			{/* Input Area - Fixed at bottom */}
			<div className="left-1/2 transform bg-gray-50 -translate-x-1/2 flex flex-col fixed bottom-0 min-w-[700px] rounded-md w-[50%]">
				<form onSubmit={handleSubmit} className="flex flex-col">
					<textarea
						ref={textareaRef}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Type message"
						rows="3"
						className="flex-1 p-2 px-3 mb-2 rounded-xl border border-gray-200 bg-blue-100/50"
					/>
					<div className="flex items-center mb-2 space-x-3">
						<button
							type="submit"
							disabled={isLoading}
							className={`text-sm text-gray-500 rounded-lg cursor-pointer hover:text-gray-800 ${
								isLoading
									? "text-red-400 hover:text-red-500 font-bold"
									: ""
							}`}
						>
							{isLoading
								? "cancel message"
								: "Ctrl 󰌑 or click to send"}
						</button>
						{/* Button to cancel the stream */}
						{isLoading && (
							<button
								type="button"
								onClick={handleCancelStream}
								className="py-1 px-3 text-sm text-white bg-red-500 rounded hover:bg-red-600"
							>
								Stop Stream
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

export default App;
