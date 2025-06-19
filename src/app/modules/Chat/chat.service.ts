import { TeamServices } from "../Team/team.service";
import { Chat } from "./chat.model";

const createTeamChat = async (teamName: string) => {
  const existingChat = await Chat.findOne({ teamName });
  if (existingChat) {
    throw new Error(`Chat for team "${teamName}" already exists.`);
  }

  const newChat = await Chat.create({ teamName });
  return newChat;
};

const addMessageToTeamChat = async (teamName: string, messageData: {
  timestamp?: Date;
  messageText: string;
  senderName: string;
  senderEmail: string;
}) => {
  const chat = await Chat.findOneAndUpdate(
    { teamName },
    { $push: { messages: messageData } },
    { new: true, runValidators: true }
  );

  if (!chat) {
    throw new Error(`Chat for team "${teamName}" not found.`);
  }

  return chat;
};

const getTeamChatByTeamId = async (teamId: string) => {
  const team = await TeamServices.getSingleTeamByTeamId(teamId);
  if (!team) {
    throw new Error(`Team with ID "${teamId}" not found.`);
  }

  const chat = await Chat.findOne({ teamName: team.teamName });
  if (!chat) {
    throw new Error(`No chat found for team "${team.teamName}".`);
  }

  return chat;
};

export const TeamChatServices = {
  createTeamChat,
  addMessageToTeamChat,
  getTeamChatByTeamId,
};