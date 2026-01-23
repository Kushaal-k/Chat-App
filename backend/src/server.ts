import express, { type Response, type Request } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(express.json())
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173"
    }
})

type Message = {
    text: string,
    sender: string
}


let typingUsers = new Map<string, string[]>()
const roomMessages = new Map<string, Message[]>()
const users = new Map<string, string[]>()

io.on("connection", (socket) => {
    console.log("Connected: ", socket.id);

    socket.on("join-room", ({ roomId, username }: { roomId: string, username: string }) => {
        socket.join(roomId);

        console.log(username);

        const prev = users.get(roomId) ?? []
        users.set(roomId, [...prev, username])

        io.to(roomId).emit("room-users", users.get(roomId) ?? [])

        io.to(roomId).emit("joined-user", username)

        const history = roomMessages.get(roomId) ?? [];
        socket.emit("room-history", history)

        console.log(`${socket.id} joined ${roomId}`);

    })

    socket.on("room-messages", ({ roomId, msg }: { roomId: string, msg: Message }) => {
        if (!socket.rooms.has(roomId)) {
            console.log("You are not connected to the room");
            return;
        }
        const prev = roomMessages.get(roomId) ?? [];
        roomMessages.set(roomId, [...prev, msg])

        io.to(roomId).emit("room-messages", msg)
    })

    socket.on("leave-room", ({ roomId, username }: { roomId: string, username: string }) => {
        socket.leave(roomId);

        const prev = users.get(roomId) ?? [];
        const updated = prev.filter((u) => u !== username)

        if (updated.length === 0) {
            users.delete(roomId);
        }
        else {
            users.set(roomId, updated)
        }

        socket.to(roomId).emit("room-users", users.get(roomId) ?? [])

        socket.to(roomId).emit("left-user", username)

        console.log(`${username} left ${roomId}`);
    })

    socket.on("user-type", ({ roomId, username }: { roomId: string, username: string }) => {
        
        const prev = typingUsers.get(roomId) ?? []
        if(!prev.includes(username)){
            prev.push(username)
            typingUsers.set(roomId, prev)
            socket.to(roomId).emit("typing-user", typingUsers.get(roomId) ?? [])
        }
        else{
            const updated = prev.filter((u) => u !== username)
            typingUsers.set(roomId, updated)
            socket.to(roomId).emit("typing-user", typingUsers.get(roomId) ?? [])
        }
    })



    socket.on("disconnect", () => {
        console.log("Disconnected: ", socket.id);

        users.forEach((value, key) => {
            if (value.includes(socket.id)) {
                users.delete(key);
            }
        })
    })
})

httpServer.listen(3000, () => {
    console.log("Server running at port 3000");
});