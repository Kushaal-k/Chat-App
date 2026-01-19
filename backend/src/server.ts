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

io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    })
})

httpServer.listen(3000, () => {
    console.log("Server running at port 3000");
});