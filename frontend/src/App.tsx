import MessageInput from "./components/MessageInput";
import { useEffect, useState } from "react";
import { socket } from "./socket.ts";
import { Input } from "./components/ui/input.tsx";
import { Button } from "./components/ui/button.tsx";
import { Separator } from "./components/ui/separator.tsx";

//TODO: Leave room
//TODO: Online users list 
//TODO: Typing indicator
//TODO: ACK system
//TODO: Read receipts
//TODO: Private messages

type Message = {
	text: string;
	sender: string;
};

function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [name, setName] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");
	const [joinedRoomId, setJoinedRoomId] = useState<string>("");
	const [onlineUser, setOnlineUser] = useState<string[]>([])
	const [typingUser, setTypingUser] = useState<string[]>([])


	const joinRoom = () => {
		if(!name.trim()) return;
		if(!roomId.trim()) return;
		setJoinedRoomId(roomId)

		// socket.emit("join-room", roomId, name)
		socket.emit("join-room", {roomId, username: name})
		console.log("Joined Room: ", roomId);
		
		setMessages([])
	}

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		if (!roomId.trim()) return;

		const msg: Message = { text, sender: name || "anonymus"};	
    
		socket.emit("room-messages", {roomId: joinedRoomId, msg})
	};

	const typing = () => {
		socket.emit("user-type", {roomId: joinedRoomId, username: name})
	}

	const leaveRoom = () => {
		socket.emit("leave-room", {roomId: joinedRoomId, username: name})
		setMessages([{text: "You left the room", sender: ""}])
		setRoomId("")
		setOnlineUser([]);
	}

    useEffect(() => {
		socket.on("connect", () => {
			console.log("Socket is connected");
		});

		socket.on("room-users", (onlineUser: string[]) => {
			setOnlineUser(onlineUser)
		})

		socket.on("room-history", (history: Message[]) => {
			setMessages((prev) => [...history, ...prev]);
		})

		socket.on("room-messages", (msg: Message) => {
			setMessages((prev) => [...prev, msg])
		})

		socket.on("joined-user", (username: string) => {
			setMessages((prev) => [...prev, {text: `${username || "anonymous"} joined the room`, sender: ""}])
		})

		socket.on("left-user", (username: string) => {
			setMessages((prev) => [...prev, {text: `${username} left the room`, sender: ""}])
		})

		socket.on("typing-user", (typeUser: string[]) => {
			setTypingUser(typeUser);
			const temp = typeUser.filter((x) => x !== "").join(",");
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
			<div className='flex items-center ml-4'>
				<p>Name: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => setName(e.target.value)}
					value={name}
				/>
			</div>
			<div className='flex items-center ml-4'>
				<p>Room ID: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => {
						setRoomId(e.target.value);
						console.log("Joined Room: ", e.target.value);
					}}
					value={roomId}
				/>
			</div>
			<Button onClick={joinRoom} className="mx-4 my-4">Join</Button>
			<Button onClick={leaveRoom} className="mx-4 my-4">Leave</Button>
			<div className="m-2 border border-black rounded-xl p-4 flex flex-col gap-4">
				<div className="font-bold">Online Users </div>
				{onlineUser.map((user, index) => (
					<div key={index} className="flex items-center gap-2">
						<div className="rounded-full bg-green-400 h-2 w-2"></div>{user}</div>
				))}
			</div>
			<div className="border mx-2 border-black  flex flex-col gap-4 p-4 rounded-xl h-96 overflow-y-auto">
				<div className="self-center text-2xl font-bold">CHAT APP</div>
				<Separator />
				{messages.map((message, index) => (
					<div
						key={index}
						className={` rounded-xl px-4 py-2 w-fit ${(message.sender === name) ? "self-end" : ""} ${(!message.sender) ? "self-center bg-gray-200" : "bg-green-500"}`}
					>
						{message.sender ? `${message.text} - ${message.sender}` : `${message.text.toUpperCase()}`}
						
					</div>
				))}
				<div className=" mt-auto">
					<div className="pl-2  rounded-xl w-80">
						{typingUser.length > 0 ? `${typingUser.filter((x) => (x!=="" && x !== name)).join(",")} is typing...`: ""} 
					</div>
					<MessageInput onSend={sendMessage} disabled={!joinedRoomId.trim()} onFocus={typing} />
				</div>
			</div>
		</>
	);
}

export default App;
