import MessageInput from "./components/MessageInput";
import { useRef } from "react";
import { Button } from "./components/ui/button.tsx";
import { Separator } from "./components/ui/separator.tsx";
import { Clock, CheckCheck, X } from "lucide-react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox"
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

// Import custom hooks
import useAuth from "./hooks/useAuth";
import useChat from "./hooks/useChat";
import useUsers from "./hooks/useUsers";
import useAutoScroll from "./hooks/useAutoScroll";

//TODO: Leave room - Done
//TODO: Online users list - Done
//TODO: Typing indicator - Done
//TODO: ACK system - Done
//TODO: Read receipts
//TODO: Private messages

function App() {
	// Get authentication state
	const { username } = useAuth();

	// Get chat functionality
	const {
		messages,
		onlineUsers,
		usersTyping,
		joinedRoomId,
		joinRoom,
		leaveRoom,
		startPrivateChat,
		typing,
		sendMessage,
	} = useChat(username);

	// Get users list for private messaging
	const { users } = useUsers(username);

	// Auto-scroll ref
	const messageEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll on new messages or typing
	useAutoScroll({ messages, typingUser: usersTyping, messageEndRef  });

	return (
		<>
			<Combobox<string> items={users} onValueChange={(value) => startPrivateChat(value)}>
				<ComboboxInput placeholder="Start private chat..." />
				<ComboboxContent>
					<ComboboxEmpty>No users found.</ComboboxEmpty>
					<ComboboxList >
						{(item) => (
							<ComboboxItem key={item} value={item}>
								{item}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			<Button onClick={leaveRoom} className="mx-4 my-4">Leave</Button>
			<div className="m-2 border border-black rounded-xl p-4 flex flex-col gap-4">
				<div className="font-bold">Online Users </div>
				{onlineUsers.map((user, index) => (
					<div key={index} className="flex items-center gap-2">
						<div className="rounded-full bg-green-400 h-2 w-2"></div>{user}</div>
				))}
			</div>
			<div className="border mx-2 border-black flex  gap-4 p-4 rounded-xl h-96 overflow-y-auto">
				<div className="text-sm w-lg flex flex-col gap-4">

					<div className="text-lg">Global Rooms</div>
					<Separator />
					<div onClick={() => joinRoom("Room1")} className="cursor-pointer">Room1</div>
					<div onClick={() => joinRoom("Room2")} className="cursor-pointer">Room2</div>
					<div onClick={() => joinRoom("Room3")} className="cursor-pointer">Room3</div>

					<Separator />

					<div className="text-lg">Private Messaging</div>
					<Separator />
					<div>Room1</div>
					<div>Room2</div>
					<div>Room3</div>
				</div>
				<div>
					<Separator orientation="vertical" className="h-full" />
				</div>
				<ScrollArea className="w-full p-4 rounded-md scroll-auto scroll-auto">
					<div className="w-full flex flex-col">
						<div className="w-full mb-2">
							<div className="text-2xl font-bold justify-self-center">CHAT APP</div>
							<Separator />
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex flex-col w-fit max-w-xs mt-4 ${message.sender === username ? "justify-self-end items-end" : ""} ${!message.sender ? "justify-self-center" : ""}`}
								>

									{message.sender && (
										<div className="text-xs text-gray-500 mb-1 px-1">
											{message.sender}
										</div>
									)}


									<div className={`rounded-xl px-4 py-2 ${!message.sender ? "bg-gray-200 text-xs text-center" : message.sender === username ? "bg-green-500 text-white" : "bg-gray-300"}`}>

										<div className="text-sm">
											{message.sender ? message.text : message.text.toUpperCase()}
										</div>


										{message.sender && (
											<div className="flex items-center justify-end gap-2 mt-1">
												<span className="text-xs opacity-70">
													{message.time
														? new Date(message.time).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false
														}) : ""}
												</span>
												{message.sender === username &&
													(
														<>
															{message.status === "Pending" && <span className="text-xs opacity-70"><Clock size={16} /></span>}
															{message.status === "Sent" && <span className="text-xs opacity-70"><CheckCheck size={16} /></span>}
															{message.status === "Failed" && <span className="text-xs opacity-70 text-red-400"><X size={16} /></span>}
														</>
													)
												}
											</div>
										)}
									</div>
								</div>
							))}

						</div>
						<div className="mt-auto">
							<div className="pl-2  rounded-xl w-80">
								{usersTyping.length > 0 ? `${usersTyping.filter((x) => (x !== "" && x !== username)).join(",")} is typing...` : ""}
							</div>
							<div className="">
								<MessageInput onSend={sendMessage} disabled={!joinedRoomId.trim()} onFocus={typing} />
							</div>
						</div>
					</div>
					<div ref={messageEndRef} />
				</ScrollArea>
			</div>
		</>
	);
}

export default App;
