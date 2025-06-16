import { Server } from "socket.io";
import { Chat } from "./chat.model";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a room based on teamId
    socket.on("joinRoom", (teamId: string) => {
      socket.join(teamId);
      console.log(`User ${socket.id} joined room: ${teamId}`);
    });

    // Handle sending a message
    socket.on("sendMessage", async (data: { teamId: string; senderEmail: string; message: string }) => {
      const { teamId, senderEmail, message } = data;
      const timestamp = new Date();

      // Save message to database
      const newMessage = await Chat.create({ teamId, senderEmail, message, timestamp });

      // Emit message to all users in the room
      io.to(teamId).emit("receiveMessage", {
        _id: newMessage._id,
        teamId,
        senderEmail,
        message,
        timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;