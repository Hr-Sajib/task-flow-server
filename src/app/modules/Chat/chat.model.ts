// src/app/modules/Team/teamMessage.model.ts

import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messageText: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
});

const TeamChatSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = model("TeamMessage", TeamChatSchema);
