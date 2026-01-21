import MessageInput from "./components/MessageInput";
import { useEffect, useState } from "react";
import { socket } from "./socket.ts";
import { Input } from "./components/ui/input.tsx";
import { Button } from "./components/ui/button.tsx";

type Message = {
	text: string;
	sender: string;
};

function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [name, setName] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");

	const joinRoom = () => {
		if(!name.trim()) return;
		if(!roomId.trim()) return;

		// socket.emit("join-room", roomId, name)
		socket.emit("join-room", {roomId: roomId, username: name})
		console.log("Joined Room: ", roomId);
		setMessages([])
	}

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		if (!roomId.trim()) return;

		const msg: Message = { text, sender: name || "anonymus"};	
    
		socket.emit("room-messages", {roomId, msg})
	};


    useEffect(() => {
		socket.on("connect", () => {
			console.log("Socket is connected");
		});

		socket.on("room-history", (history: Message[]) => {
			setMessages((prev) => [...prev, ...history]);
		})

		socket.on("room-messages", (msg: Message) => {
			setMessages((prev) => [...prev, msg])
		})

		socket.on("joined-user", (username: string) => {
			setMessages((prev) => [...prev, {text: `${username || "anonymous"} joined the room`, sender: ""}])
		})

		return () => {
			socket.off("connect");
			socket.off("room-history")
			socket.off("room-messages")
			socket.off("joined-user")
		}
    }, []);

	return (
		<>
			<div className='flex items-center ml-4'>
				<p>Name: </p>
				<Input
					className='m-4 w-fit'
					onChange={(e) => setName(e.target.value)}
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
				/>
			</div>
			<Button onClick={joinRoom} className="mx-4 my-4">Join</Button>
			<MessageInput onSend={sendMessage} />
			{messages.map((message, index) => (
				<div
					key={index}
					className='bg-green-500 rounded-xl px-2 w-fit my-2 ml-4'
				>
					{message.sender ? `${message.text} - ${message.sender}` : `${message.text.toUpperCase()}`}
					
				</div>
			))}
		</>
	);
}

export default App;
