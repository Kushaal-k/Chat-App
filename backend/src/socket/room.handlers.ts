import { Server, Socket } from "socket.io";

const users = new Map<string, string[]>();

export const registerRoomHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("join-room", 
        ({ roomId, username }: {roomId: string, username: string}) => {
            socket.join(roomId);
        }
    )
}