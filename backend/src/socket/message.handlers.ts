import {Server, Socket} from "socket.io"
import { createMessage } from "../services/message.service.js";

export const registerMessageHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("room-messages", async (
        payload: {
            roomId: string;
            sender: string;
            text: string;
        },
        callback: (response: {ok: boolean}) => void
    ) => {
        try {
            const { roomId, sender, text } = payload;

            if(!socket.rooms.has(roomId)){
                return callback({ok: false})
            }

            const message = await createMessage({
                roomId,
                sender,
                text
            });

            io.to(roomId).emit("room-messages", message)

            callback({ok: true})
        } catch (error) {
            callback({ok: false})
        }
    })
}       