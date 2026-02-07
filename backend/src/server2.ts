// import { createServer } from "http"
// import { Server } from "socket.io"
// import mongoose from "mongoose"
// import { app } from "./app.js"

// export const httpServer = createServer(app);

// const io = new Server(httpServer, {
//     cors: {
//         origin: true
//     }
// })

// type Message = {
//     id: string,
//     text: string,
//     sender: string,
//     time: string,
//     status: string
// }


// let typingUsers = new Map<string, string[]>()
// const roomMessages = new Map<string, Message[]>()
// const users = new Map<string, string[]>()
// const socketUserMap = new Map<string, { username: string, roomId: string }>()

// io.on("connection", (socket) => {
//     console.log("Connected: ", socket.id);

//     socket.on("join-room", ({ roomId, username }: { roomId: string, username: string }) => {
//         socket.join(roomId);

//         console.log(username);

//         socketUserMap.set(socket.id, { username, roomId });

//         const prev = users.get(roomId) ?? []
//         users.set(roomId, [...prev, username])

//         io.to(roomId).emit("room-users", users.get(roomId) ?? [])

//         io.to(roomId).emit("joined-user", username)

//         const history = roomMessages.get(roomId) ?? [];
//         socket.emit("room-history", history)

//         console.log(`${socket.id} joined ${roomId}`);

//     })

//     socket.on("room-messages", ({ roomId, msg }: { roomId: string, msg: Message }, callback) => {

//         try {
//             if (!socket.rooms.has(roomId)) {
//                 console.log("You are not connected to the room");
//                 return;
//             }
//             const prev = roomMessages.get(roomId) ?? [];
//             roomMessages.set(roomId, [...prev, { ...msg, status: "Sent" }])

//             socket.to(roomId).emit("room-messages", { ...msg, status: "Sent" })

//             callback({ ok: true })
//         }
//         catch (error) {
//             callback({ ok: false })
//         }

//     })

//     socket.on("leave-room", ({ roomId, username }: { roomId: string, username: string }) => {
//         socket.leave(roomId);

//         const prev = users.get(roomId) ?? [];
//         const updated = prev.filter((u) => u !== username)

//         if (updated.length === 0) {
//             users.delete(roomId);
//         }
//         else {
//             users.set(roomId, updated)
//         }

//         socket.to(roomId).emit("room-users", users.get(roomId) ?? [])

//         socket.to(roomId).emit("left-user", username)

//         console.log(`${username} left ${roomId}`);
//     })

//     socket.on("user-type", ({ roomId, username }: { roomId: string, username: string }) => {

//         const prev = typingUsers.get(roomId) ?? []
//         if (!prev.includes(username)) {
//             prev.push(username)
//             typingUsers.set(roomId, prev)
//             socket.to(roomId).emit("typing-user", typingUsers.get(roomId) ?? [])
//         }
//         else {
//             const updated = prev.filter((u) => u !== username)
//             typingUsers.set(roomId, updated)
//             socket.to(roomId).emit("typing-user", typingUsers.get(roomId) ?? [])
//         }
//     })



//     socket.on("disconnect", () => {
//         console.log("Disconnected: ", socket.id);

//         const userInfo = socketUserMap.get(socket.id);

//         if (userInfo) {
//             const { username, roomId } = userInfo;

//             const roomUsers = users.get(roomId) ?? [];
//             const updatedUsers = roomUsers.filter(u => u !== username);

//             if (updatedUsers.length === 0) {
//                 users.delete(roomId);
//             } else {
//                 users.set(roomId, updatedUsers);
//             }

//             const roomTyping = typingUsers.get(roomId) ?? [];
//             typingUsers.set(roomId, roomTyping.filter(u => u !== username));

//             io.to(roomId).emit("room-users", users.get(roomId) ?? []);
//             io.to(roomId).emit("left-user", username);
//             io.to(roomId).emit("typing-user", typingUsers.get(roomId) ?? []);

//             socketUserMap.delete(socket.id);

//             console.log(`${username} disconnected from ${roomId}`);
//         }
//     })
// })

// import userRouter from "./routes/user.routes.js"

// app.use('/users', userRouter)

// httpServer.listen(3000, () => {
//     console.log("Server running at port 3000");
// });