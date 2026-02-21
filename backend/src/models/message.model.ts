import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: String,
      required: true,
    },

    roomId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "failed"],
      default: "failed",
    },
  },
  { timestamps: true }
);

messageSchema.index({ roomId: 1, _id: -1 });

export const Message = model("Message", messageSchema);