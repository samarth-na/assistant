import React, { useRef, useEffect } from "react";
import ChatSelector from "./model.jsx";

const MessageOutput = ({ messages, chat, setChat }) => {
	const chatContainerRef = useRef(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
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
	);
};

export default MessageOutput;
