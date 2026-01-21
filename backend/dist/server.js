import express, {} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173"
    }
});
let messages = [];
const roomMessages = new Map();
io.on("connection", (socket) => {
    console.log("Connected: ", socket.id);
    // socket.emit("messages", messages)
    // socket.on("send-message", (msg: Message) => {
    //     messages.push(msg);
    //     socket.broadcast.emit("new-message", msg)
    //     console.log(messages);
    // })
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        const history = roomMessages.get(roomId) ?? [];
        socket.emit("room-history", history);
        console.log(`${socket.id} joined ${roomId}`);
    });
    socket.on("room-messages", ({ roomId, msg }) => {
        const prev = roomMessages.get(roomId) ?? [];
        roomMessages.set(roomId, [...prev, msg]);
        io.to(roomId).emit("room-messages", msg);
    });
});
httpServer.listen(3000, () => {
    console.log("Server running at port 3000");
});
//# sourceMappingURL=server.js.map