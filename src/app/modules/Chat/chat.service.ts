import { Chat } from "./chat.model";

const accessChatFromDB = async (userId: string, currentUserId: string) => {
  const existing = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: currentUserId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (existing.length > 0) return existing[0];

  const created = await Chat.create({
    chatName: "sender",
    isGroupChat: false,
    users: [currentUserId, userId],
  });

  const fullChat = await Chat.findById(created._id).populate("users", "-password");
  return fullChat;
};

const fetchChatsFromDB = async (userId: string) => {
  return Chat.find({ users: { $elemMatch: { $eq: userId } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .lean();
};

const createGroupChatInDB = async (name: string, users: any[], adminUser: any) => {
  const group = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users: [...users, adminUser],
    groupAdmin: adminUser,
  });

  return Chat.findById(group._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
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