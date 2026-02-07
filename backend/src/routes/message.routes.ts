import { Router } from "express";
import { createRoomMessages, getRoomMessagesHistory } from "../controllers/message.controller.js";
import { validateCreateMessage } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/rooms/:roomId/messages/history", getRoomMessagesHistory);
router.post("/rooms/:roomId/messages", validateCreateMessage, createRoomMessages)

export default router