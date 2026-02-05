import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const Message = model("Message", messageSchema);