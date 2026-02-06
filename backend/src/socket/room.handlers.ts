import { Server, Socket } from "socket.io";

const users = new Map<string, string[]>();

export const registerRoomHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("join-room", 
        ({ roomId, username }: {roomId: string, username: string}) => {
            socket.join(roomId);

            const prev = users.get(roomId) ?? [];
            users.set(roomId, [...prev, username])

            io.to(roomId).emit("room-users", users.get(roomId));
        }
    )

    socket.on("leave-room", 
        ({ roomId, username }: {roomId: string, username: string}) =>{
            socket.leave(roomId);

            const prev = users.get(roomId) ?? [];    
            const updated = prev.filter((u: string) => u !== username);

            updated.length == 0 ? users.delete(roomId) : users.set(roomId, updated);

            io.to(roomId).emit("room-users", users.get(roomId) ?? []);
        }
    )
}