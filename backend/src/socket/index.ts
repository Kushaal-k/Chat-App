import { Server } from "socket.io"
import { registerRoomHandlers } from "./room.handlers.js"
import { registerMessageHandlers } from "./message.handlers.js"

export const initSockets = (io: Server) => {
    io.on("connection", (socket) => {
        registerMessageHandlers(io, socket)
        registerRoomHandlers(io, socket)
    })
}