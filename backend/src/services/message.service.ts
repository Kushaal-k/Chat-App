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
import {Message} from "../models/message.model.js";

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
        roomId: new mongoose.Types.ObjectId(roomId)
    };

    if(cursor){
        query._id = { $lt: new mongoose.Types.ObjectId(cursor)};
    }

    const messages = await Message.find(query)
        .sort({ _id: -1})
        .limit( limit+1 )

    const hasMore = messages.length > limit;

    if(hasMore){
        messages.pop();
    }

    const lastMessage = messages.at(-1);

    return {
        messages,
        nextCursor: lastMessage ? lastMessage._id.toString() : null,
        hasMore
    }
}

type  CreateMessageParams = {
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

    return message; 
}

export {getRoomMessages, createMessage}