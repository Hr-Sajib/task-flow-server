import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TeamChatServices } from "./chat.service";

const createTeamChatController = catchAsync(async (req, res) => {
  const { teamName } = req.body;
  const result = await TeamChatServices.createTeamChat(teamName);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Team chat for "${teamName}" created successfully.`,
    data: result,
  });
});

const addMessageToTeamChatController = catchAsync(async (req, res) => {
  const { teamName } = req.params;
  const messageData = req.body;
  const result = await TeamChatServices.addMessageToTeamChat(teamName, messageData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Message added to team chat "${teamName}" successfully.`,
    data: result,
  });
});

const getTeamChatByTeamIdController = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const result = await TeamChatServices.getTeamChatByTeamId(teamId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Team chat retrieved successfully for team ID "${teamId}".`,
    data: result,
  });
});

export const TeamChatControllers = {
  createTeamChatController,
  addMessageToTeamChatController,
  getTeamChatByTeamIdController,
};