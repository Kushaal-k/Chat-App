// POST /rooms/:roomId/messages/history -- Endpoint for pagination 
// Request - 
// {
//   "cursor": "65d91f3e9c1e2a...",
//   "limit": 20
// }

// Response -- 
// {
//   "messages": [
//     {
//       "_id": "65d91f...",
//       "roomId": "room123",
//       "sender": "buddy",
//       "text": "hello",
//       "status": "Sent",
//       "createdAt": "2026-02-05T12:30:00Z"
//     }
//   ],
//   "nextCursor": "65d91f...", -- using _id as cursor ( default indexed & time based )
//   "hasMore": true  -- is false when there is no older message
// }



import mongoose from "mongoose";
import { Message } from "../models/message.model.js";

// Maps a MongoDB message document to the shape the frontend expects
const toClientMessage = (doc: any) => ({
    id: doc._id.toString(),
    text: doc.content,
    sender: doc.sender,
    time: doc.createdAt?.toISOString?.() ?? doc.createdAt ?? "",
    status: doc.status === "sent" ? "Sent"
        : doc.status === "delivered" ? "Delivered"
            : "Failed",
});

type GetRoomMessagesParams = {
    roomId: string;
    cursor?: string | null;
    limit?: number
}

const getRoomMessages = async ({
    roomId,
    cursor = null,
    limit = 40
}: GetRoomMessagesParams) => {
    const query: any = {
        roomId
    };

    if (cursor) {
        query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const messages = await Message.find(query)
        .sort({ _id: -1 })
        .limit(limit + 1)

    const hasMore = messages.length > limit;

    if (hasMore) {
        messages.pop();
    }

    const lastMessage = messages.at(-1);

    return {
        messages: messages.reverse().map(toClientMessage),
        nextCursor: lastMessage ? lastMessage._id.toString() : null,
        hasMore
    }
}

type CreateMessageParams = {
    roomId: string;
    sender: string;
    text: string;
}

const createMessage = async ({
    roomId,
    sender,
    text
}: CreateMessageParams) => {
    const message = await Message.create({
        roomId,
        sender,
        content: text,
        status: "sent"
    });

    return toClientMessage(message);
}

export { getRoomMessages, createMessage }