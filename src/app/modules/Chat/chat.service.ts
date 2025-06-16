import { TChatMessage } from "./chat.interface";
import { Chat } from "./chat.model";


const saveMessage = async (messageData: TChatMessage) => {
  const result = await Chat.create(messageData);
  return result;
};

const getChatHistory = async (teamId: string) => {
  const result = await Chat.find({ teamId }).sort({ timestamp: -1 });
  return result;
};

export const ChatService = {
  saveMessage,
  getChatHistory,
};