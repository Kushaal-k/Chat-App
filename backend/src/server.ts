import { createServer } from "http"
import { Server } from "socket.io"
import { app } from "./app.js"
import { initSockets } from "./socket/index.js";

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
})

initSockets(io);

import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"

app.use('/users', userRouter)
