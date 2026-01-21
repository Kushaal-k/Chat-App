import  express, { type Response, type Request } from "express"
import  {createServer} from "http"
import  { Server } from "socket.io"
import  cors from "cors"

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


let messages: Message[] = []
const roomMessages = new Map<string, Message[]>()

io.on("connection", (socket) => {
    console.log("Connected: ", socket.id);
    
    socket.on("join-room", ({roomId, username}: {roomId: string, username: string}) => {
        socket.join(roomId);
        console.log(username);

        io.to(roomId).emit("joined-user", username)

        const history = roomMessages.get(roomId) ?? [];
        socket.emit("room-history", history)

        console.log(`${socket.id} joined ${roomId}`);
    })

    socket.on("room-messages", ({roomId, msg}: {roomId: string, msg: Message}) => {

        const prev = roomMessages.get(roomId) ?? [];
        roomMessages.set(roomId, [...prev, msg])

        io.to(roomId).emit("room-messages", msg)
    })
})

httpServer.listen(3000, () => {
    console.log("Server running at port 3000");
});