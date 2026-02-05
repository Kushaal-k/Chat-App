import { Schema, model } from "mongoose";

const roomSchema = new Schema(
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

export const Room =  model("Room", roomSchema);
