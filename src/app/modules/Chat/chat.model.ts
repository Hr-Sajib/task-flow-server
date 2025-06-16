import { Schema, model } from 'mongoose';
import { TChatMessage } from './chat.interface';

// Define the schema
const chatSchema = new Schema<TChatMessage>({
  teamId: {
    type: String,
    required: [true, 'Team ID is required'],
  },
  senderEmail: {
    type: String,
    required: [true, 'Sender email is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export const Chat = model<TChatMessage>('Chat', chatSchema);
