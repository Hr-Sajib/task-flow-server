// chat.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChatService } from "./chat.service";

const accessChat = catchAsync(async (req: Request, res: Response) => {
  const { userEmployeeId } = req.body;
  if (!userEmployeeId) return res.status(400).json({ message: "userEmployeeId is required" });

  const result = await ChatService.accessChatFromDB(userEmployeeId, req.user?.userEmployeeId);
  res.status(200).json(result);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   message: '',
  //   success: true,
  //   data: result
  // })
});

const fetchChats = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.fetchChatsFromDB(req.user?.userEmployeeId);
  res.status(200).json(result);
});

const createGroupChat = catchAsync(async (req: Request, res: Response) => {
  const { name, users } = req.body;
  if (!users || !name) return res.status(400).json({ message: "name & users are required" });

  const parsedUsers = typeof users === "string" ? JSON.parse(users) : users;
  if (parsedUsers.length < 2) return res.status(400).json({ message: "At least 2 users required" });

  const result = await ChatService.createGroupChatInDB(name, parsedUsers, req.user);
  res.status(201).json(result);
});

const renameGroup = catchAsync(async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;
  const result = await ChatService.renameGroupChatInDB(chatId, chatName);
  res.status(200).json(result);
});

const removeFromGroup = catchAsync(async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;
  const result = await ChatService.removeFromGroupInDB(chatId, userId);
  res.status(200).json(result);
});

const addToGroup = catchAsync(async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;
  const result = await ChatService.addToGroupInDB(chatId, userId);
  res.status(200).json(result);
});

export const ChatController = {accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup}
