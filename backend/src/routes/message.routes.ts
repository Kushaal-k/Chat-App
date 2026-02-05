import { Router } from "express";
import { createRoomMessages, getRoomMessagesHistory } from "../controllers/message.controller.js";

const router = Router();

router.post("/rooms/:roomId/messages/history", getRoomMessagesHistory);
router.post("/rooms/:roomId/messages", createRoomMessages)

export default router