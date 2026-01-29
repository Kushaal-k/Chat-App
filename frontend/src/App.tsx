import MessageInput from "./components/MessageInput";
import { useEffect, useState } from "react";
import { socket } from "./socket.ts";
import { Input } from "./components/ui/input.tsx";
import { Button } from "./components/ui/button.tsx";
import { Separator } from "./components/ui/separator.tsx";
import { Clock, CheckCheck, X } from "lucide-react";
import api from "./lib/userApi.ts";

//TODO: Leave room - Done
//TODO: Online users list - Done
//TODO: Typing indicator - Done
//TODO: ACK system - Done
//TODO: Read receipts
//TODO: Private messages

type Message = {
	id: string
	text: string;
	sender: string;
	time: string;
	status: "Pending" | 'Sent' | 'Failed';
};

function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("")
	const [roomId, setRoomId] = useState<string>("");
	const [joinedRoomId, setJoinedRoomId] = useState<string>("");
	const [onlineUser, setOnlineUser] = useState<string[]>([])
	const [typingUser, setTypingUser] = useState<string[]>([])

	const joinRoom = (roomId: string) => {
		if (!name.trim()) return;
		if (!roomId.trim()) return;
		setJoinedRoomId(roomId)

		// socket.emit("join-room", roomId, name)
		socket.emit("join-room", { roomId, username: name })
		console.log("Joined Room: ", roomId);

		setMessages([])
	}

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		if (!roomId.trim()) return;

		const msg: Message = {
			id: crypto.randomUUID(),
			text,
			sender: name || "anonymus",
			time: (new Date().toISOString()),
			status: "Pending"
		};

		setMessages((prev) => [...prev, msg])

		socket.emit("room-messages", { roomId: joinedRoomId, msg }, (ack: any) => {
			setMessages((prev) =>
				prev.map((message) => message.id === msg.id ? { ...message, status: ack.ok ? "Sent" : "Failed" } : message)
			)
		})
	};

	const typing = () => {
		socket.emit("user-type", { roomId: joinedRoomId, username: name })
	}

	const leaveRoom = () => {
		socket.emit("leave-room", { roomId: joinedRoomId, username: name })
		const date = new Date().toISOString()
		setMessages([{ id: crypto.randomUUID(), text: "You left the room", sender: "", time: `${date}`, status: "Sent" }])
		setRoomId("")
		setOnlineUser([]);
	}

	useEffect(() => {
		socket.on("connect", () => {
			console.log("Socket is connected");
		});

		const storedData = localStorage.getItem('user')

		if(storedData){
			const user = JSON.parse(storedData);
			setName(user.username)
			setPassword(user.password)
		}

		socket.on("room-users", (onlineUser: string[]) => {
			setOnlineUser(onlineUser)
		})

		socket.on("room-history", (history: Message[]) => {
			setMessages((prev) => [...history, ...prev]);
		})

		socket.on("room-messages", (msg: Message) => {
			setMessages((prev) => {
				if (prev.some(m => m.id == msg.id)) return prev;
				return [...prev, msg];
			})
		})

		socket.on("joined-user", (username: string) => {
			setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: `${username || "anonymous"} joined the room`, sender: "", time: "", status: "Sent" }])
		})

		socket.on("left-user", (username: string) => {
			setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: `${username} left the room`, sender: "", time: "", status: "Sent" }])
		})

		socket.on("typing-user", (typeUser: string[]) => {
			setTypingUser(typeUser);
		})

		return () => {
			socket.off("connect")
			socket.off("room-history")
			socket.off("room-messages")
			socket.off("joined-user")
			socket.off("left-user")
			socket.off("room-users")
			socket.off("typing-user")
		}
	}, []);

	return (
		<>
			{/* <div className='flex items-center ml-4'>
				<p>Name: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => setName(e.target.value)}
					value={name}
				/>
			</div>
			<div className='flex items-center ml-4'>
				<p>Password: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => {
						setPassword(e.target.value)
					}}
					type="password"
					value={password}
				/>
			</div>
			<Button onClick={() => registerUser(name, password)} className="mx-4 my-4">Register</Button>
			<div className='flex items-center ml-4'>
				<p>Name: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => setName(e.target.value)}
					value={name}
				/>
			</div>
			<div className='flex items-center ml-4'>
				<p>Password: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => {
						setPassword(e.target.value)
					}}
					type="password"
					value={password}
				/>
			</div>
			<Button onClick={() => loginUser(name, password)} className="mx-4 my-4">Login</Button> */}
			<Button onClick={leaveRoom} className="mx-4 my-4">Leave</Button>
			<div className="m-2 border border-black rounded-xl p-4 flex flex-col gap-4">
				<div className="font-bold">Online Users </div>
				{onlineUser.map((user, index) => (
					<div key={index} className="flex items-center gap-2">
						<div className="rounded-full bg-green-400 h-2 w-2"></div>{user}</div>
				))}
			</div>
			<div className="border mx-2 border-black flex  gap-4 p-4 rounded-xl h-96 overflow-y-auto">
				<div className="text-sm w-lg flex flex-col gap-4">

					<div className="text-lg">Global Rooms</div>
					<Separator />
					<div onClick={() => joinRoom("Room1")} className="cursor-pointer">Room1</div>
					<div>Room2</div>
					<div>Room3</div>

					<Separator />

					<div className="text-lg">Private Messaging</div>
					<Separator />
					<div>Room1</div>
					<div>Room2</div>
					<div>Room3</div>
				</div>
				<div>
					<Separator orientation="vertical" />
				</div>
				<div className="w-full ">
					<div className="self-center text-2xl font-bold ">CHAT APP</div>
					<Separator />
					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex flex-col w-fit max-w-xs ${message.sender === name ? "self-end items-end" : ""} ${!message.sender ? "self-center" : ""}`}
						>

							{message.sender && (
								<div className="text-xs text-gray-500 mb-1 px-1">
									{message.sender}
								</div>
							)}


							<div className={`rounded-xl px-4 py-2 ${!message.sender ? "bg-gray-200 text-xs text-center" : message.sender === name ? "bg-green-500 text-white" : "bg-gray-300"}`}>

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
										{message.sender === name &&
											(
												<>
													{message.status === "Pending" && <span className="text-xs opacity-70"><Clock size={16} /></span>}
													{message.status === "Sent" && <span className="text-xs opacity-70"><CheckCheck size={16} /></span>}
													{message.status === "Failed" && <span className="text-xs text-red-600"><X size={16} /></span>}
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
						{typingUser.length > 0 ? `${typingUser.filter((x) => (x !== "" && x !== name)).join(",")} is typing...` : ""}
					</div>
					<MessageInput onSend={sendMessage} disabled={!joinedRoomId.trim()} onFocus={typing} />
				</div>
			</div>
		</>
	);
}

export default App;
