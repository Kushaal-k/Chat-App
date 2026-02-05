import type { Request, Response, NextFunction } from "express"
import { createMessage, getRoomMessages } from "../services/message.service.js";

const getRoomMessagesHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;
        const { cursor = null, limit = 40 } = req.body;

        if (!roomId || typeof roomId !== 'string') {
            return res.status(400).json({ error: "roomId is required" });
        }

        const result = await getRoomMessages({
            roomId,
            cursor,
            limit
        })

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

const createRoomMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;
        const { sender, text } = req.body

        if (!roomId || typeof roomId !== 'string') {
            return res.status(400).json({ error: "roomId is required" });
        }

        const message = await createMessage({
            roomId,
            sender,
            text
        })

        return res.status(201).json(message);
    } catch (error) {
        next(error)
    }
}

export {
    createRoomMessages,
    getRoomMessagesHistory
}