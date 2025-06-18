import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { Chat } from "./chat.model";
import httpStatus from 'http-status';


const accessChatFromDB = async (userId: string, currentUserId: string) => {
  // Find actual User documents by employeeId
  const targetUser = await User.findOne({ userEmployeeId: userId });
const currentUser = await User.findOne({ userEmployeeId: currentUserId });

if (!targetUser || !currentUser) {
  throw new Error("One or both users not found.");
}

// if (targetUser._id.equals(currentUser._id)) {
//   throw new Error("You cannot create a chat with yourself.");
// }

  const existing = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: currentUser._id } } },
      { users: { $elemMatch: { $eq: targetUser._id } } },
    ],
  })
    .populate("users", "-userPassword")
    .populate("latestMessage");

  if (existing.length > 0) return existing[0];

  const created = await Chat.create({
    chatName: "sender",
    isGroupChat: false,
    users: [currentUser._id, targetUser._id],
  });

  const fullChat = await Chat.findById(created._id).populate("users", "-userPassword");

  return fullChat;
};


const fetchChatsFromDB = async (userEmployeeId: string) => {
  const user = await User.findOne({ userEmployeeId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User with ID "${userEmployeeId}" not found.`);
  }

  return Chat.find({ users: { $elemMatch: { $eq: user._id } } })
    .populate("users", "userName userEmail userEmployeeId")
    .populate("groupAdmin", "userName userEmail userEmployeeId")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .lean();
};


const createGroupChatInDB = async (name: string, users: any[], adminUser: any) => {
  // Step 1: Get admin user from DB using email or employeeId
  const admin = await User.findOne({
    userEmail: adminUser.userEmail,
    userEmployeeId: adminUser.userEmployeeId,
  });

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin user not found");
  }

  // Step 2: Extract only ObjectIds from input users
  const userIds = users.map((u) => (typeof u === "string" ? u : u._id));

  // Step 3: Create the group chat
  const group = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users: [...userIds, admin._id],
    groupAdmin: admin._id,
  });

  // Step 4: Populate and return
  return Chat.findById(group._id)
    .populate("users", "userName userEmail userEmployeeId")
    .populate("groupAdmin", "userName userEmail userEmployeeId");
};


const renameGroupChatInDB = async (chatId: string, chatName: string) => {
  const updated = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updated) throw new Error("Chat not found");

  return updated;
};

const removeFromGroupInDB = async (chatId: string, userId: string) => {
  return Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
};

const addToGroupInDB = async (chatId: string, userId: string) => {
  return Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
};


export const ChatService = {accessChatFromDB, fetchChatsFromDB, createGroupChatInDB, renameGroupChatInDB, removeFromGroupInDB, addToGroupInDB}