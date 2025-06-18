// message.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { MessageService } from "./message.service";

const allMessages = catchAsync(async (req: Request, res: Response) => {
  const chatId = req.params.chatId;
  const messages = await MessageService.getAllMessagesFromDB(chatId);

  res.status(200).json(messages);
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { content, chatId } = req.body;
  
    const message = await MessageService.sendMessageToDB(
      content,
      chatId,
      req.user.userEmployeeId  // 🔥 userEmployeeId নেওয়া হচ্ছে JWT থেকে
    );
  
    res.status(201).json(message);
  });
  

export const MessageController = {allMessages, sendMessage}
