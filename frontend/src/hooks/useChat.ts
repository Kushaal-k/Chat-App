import { useEffect, useState } from "react";
import { socket } from "./useSocket";

export type Message = {
	id: string;
	text: string;
	sender: string;
	time: string;
	status: "Pending" | "Sent" | "Failed";
};

const useChat = (username: string) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [joinedRoomId, setJoinedRoomId] = useState<string>("");
	const [onlineUser, setOnlineUser] = useState<string[]>([]);
	const [typingUser, setTypingUser] = useState<string[]>([]);

	const joinRoom = (roomId: string) => {
		if (!username.trim()) return;
		if (!roomId.trim()) return;
		if (joinedRoomId) {
			leaveRoom();
		}
		setJoinedRoomId(roomId);

		// socket.emit("join-room", roomId, name)
		socket.emit("join-room", { roomId, username });
		console.log("Joined Room: ", roomId);

		setMessages([]);
	};

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		if (!joinedRoomId.trim()) return;

		const msg: Message = {
			id: crypto.randomUUID(),
			text,
			sender: username || "anonymus",
			time: new Date().toISOString(),
			status: "Pending",
		};

		setMessages((prev) => [...prev, msg]);

		socket.emit(
			"room-messages",
			{ roomId: joinedRoomId, msg },
			(ack: any) => {
				setMessages((prev) =>
					prev.map((message) =>
						message.id === msg.id
							? { ...message, status: ack.ok ? "Sent" : "Failed" }
							: message,
					),
				);
			},
		);
	};

	const typing = () => {
		socket.emit("user-type", { roomId: joinedRoomId, username });
	};

	const leaveRoom = () => {
		socket.emit("leave-room", { roomId: joinedRoomId, username });
		const date = new Date().toISOString();
		setMessages([
			{
				id: crypto.randomUUID(),
				text: "You left the room",
				sender: "",
				time: `${date}`,
				status: "Sent",
			},
		]);
		setJoinedRoomId("");
		setOnlineUser([]);
	};

    const startPrivateChat = (selectedUser: string | null) => {
		if (!selectedUser || !username) return;

		// Create a consistent room ID by sorting usernames alphabetically
		const participants = [username, selectedUser].sort();
		const privateRoomId = `dm_${participants[0]}_${participants[1]}`;

		joinRoom(privateRoomId);
	}

    useEffect(() => {
		socket.on("connect", () => {
			console.log("Socket is connected");
		});

		// const storedData = localStorage.getItem('user')

		// if (storedData) {
		// 	const user = JSON.parse(storedData);
		// 	setName((user.username as string))
		// }

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

    return { 
        messages,
        onlineUsers: onlineUser,
        usersTyping: typingUser,
        joinedRoomId,
        joinRoom,
        leaveRoom,
        startPrivateChat,
        typing,
        sendMessage,
    }
};

export default useChat