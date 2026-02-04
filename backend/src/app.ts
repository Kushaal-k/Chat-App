import "./utils/env.js"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js";

export const app = express()


app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000), () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    }
})
.catch((err) => {
    console.log("MONOGODB Connection Failed!!", err);
})
