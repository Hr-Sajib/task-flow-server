import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChatService } from "./chat.service";

const getChatHistory = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const result = await ChatService.getChatHistory(teamId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chat history retrieved successfully.",
    data: result,
  });
});

export const ChatController = {
  getChatHistory,
};