import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    chatType: {
      type: String,
      enum: ["private", "global"],
      default: "private",
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
