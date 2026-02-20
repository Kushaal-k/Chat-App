import "./utils/env.js"
import express from "express"
import cors from "cors"
import { createServer } from "http"
import connectDB from "./config/db.js";


export const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

export const httpServer = createServer(app);


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

connectDB()
    .then(() => {
        httpServer.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 3000}`);
        })
    })
    .catch((err) => {
        console.log("MONOGODB Connection Failed!!", err);
    })
