import { Server, Socket } from "socket.io";
import { getRoomMessages } from "../services/message.service.js";

const users = new Map<string, string[]>();
const typingUsers = new Map<string, Set<string>>();

export const registerRoomHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("join-room",
        async ({ roomId, username }: { roomId: string, username: string }) => {
            socket.join(roomId);

            const prev = users.get(roomId) ?? [];
            users.set(roomId, [...prev, username])

            // Notify others in the room that a user joined
            socket.to(roomId).emit("joined-user", username);

            // Send updated online users list to everyone in the room
            io.to(roomId).emit("room-users", users.get(roomId));

            // Send chat history to the joining user
            try {
                const { messages } = await getRoomMessages({ roomId });
                socket.emit("room-history", messages);
            } catch (error) {
                console.error("Failed to fetch room history:", error);
            }
        }
    )

    socket.on("leave-room",
        ({ roomId, username }: { roomId: string, username: string }) => {
            socket.leave(roomId);

            const prev = users.get(roomId) ?? [];
            const updated = prev.filter((u: string) => u !== username);

            updated.length == 0 ? users.delete(roomId) : users.set(roomId, updated);

            // Remove from typing users
            typingUsers.get(roomId)?.delete(username);

            // Notify others that user left
            io.to(roomId).emit("left-user", username);

            // Send updated online users list
            io.to(roomId).emit("room-users", users.get(roomId) ?? []);
        }
    )

    socket.on("user-type",
        ({ roomId, username }: { roomId: string, username: string }) => {
            if (!typingUsers.has(roomId)) {
                typingUsers.set(roomId, new Set());
            }

            const roomTyping = typingUsers.get(roomId)!;
            roomTyping.add(username);

            // Broadcast typing users to the room
            socket.to(roomId).emit("typing-user", Array.from(roomTyping));

            // Auto-clear typing status after 2 seconds of inactivity
            setTimeout(() => {
                roomTyping.delete(username);
                socket.to(roomId).emit("typing-user", Array.from(roomTyping));
            }, 2000);
        }
    )
}