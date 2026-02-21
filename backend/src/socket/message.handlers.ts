import { Server, Socket } from "socket.io"
import { createMessage } from "../services/message.service.js";

type MessagePayload = {
    roomId: string;
    msg: {
        id: string;
        text: string;
        sender: string;
        time: string;
        status: string;
    }
}

export const registerMessageHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("room-messages", async (
        payload: MessagePayload,
        callback: (response: { ok: boolean }) => void
    ) => {
        try {
            const { roomId, msg } = payload;

            if (!socket.rooms.has(roomId)) {
                return callback({ ok: false })
            }

            const message = await createMessage({
                roomId,
                sender: msg.sender,
                text: msg.text
            });

            socket.to(roomId).emit("room-messages", message)

            callback({ ok: true })
        } catch (error) {
            callback({ ok: false })
        }
    })
}       