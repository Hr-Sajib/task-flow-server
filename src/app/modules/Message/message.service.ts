// message.service.ts
import { Chat } from "../Chat/chat.model";
import { Message } from "./message.model";

const getAllMessagesFromDB = async (chatId: string) => {
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email photo")
    .populate("chat");

  return messages;
};

const sendMessageToDB = async (
    content: string,
    chatId: string,
    senderId: string
  ) => {
    if (!content || !chatId) {
      throw new Error("Invalid data");
    }
  
    let message = await Message.create({
      sender: senderId,
      content,
      chat: chatId,
    });
  
    message = await message.populate("sender", "name photo");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat.users",
      select: "name email photo",
    });
  
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
    return message;
};

export const MessageService = {getAllMessagesFromDB, sendMessageToDB}
  
