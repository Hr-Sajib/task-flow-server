// src/app/modules/Chat/chat.model.ts

import { Schema, model } from 'mongoose';

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
  sender: { 
    type: String,
    required: true,
  },
});

const ChatMessageSchema = new Schema({
  teamName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
}, {
  timestamps: true,
});

export const ChatModel = model('Chat', ChatMessageSchema);
