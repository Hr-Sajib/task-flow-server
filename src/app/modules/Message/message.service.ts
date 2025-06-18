// message.service.ts
import AppError from "../../errors/AppError";
import { Chat } from "../Chat/chat.model";
import { User } from "../User/user.model";
import { Message } from "./message.model";
import httpStatus from 'http-status';

const getAllMessagesFromDB = async (chatId: string) => {
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email photo")
    .populate("chat");

  return messages;
};

const sendMessageToDB = async (
    content: string,
    chatId: string,              
    senderEmployeeId: string     
  ) => {
    if (!content || !chatId) {
      throw new Error("Invalid data");
    }
  
    // 🔍 Step 1: Find sender by employee ID
    const senderUser = await User.findOne({ userEmployeeId: senderEmployeeId });
    if (!senderUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender user not found");
    }
  
    // ✅ Step 2: Use sender’s _id
    let message = await Message.create({
      sender: senderUser._id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "userName photo");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat.users",
      select: "userName userEmail photo",
    });
  
    // 📨 Step 4: Set latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
    return message;
  };
  

export const MessageService = {getAllMessagesFromDB, sendMessageToDB}
  
