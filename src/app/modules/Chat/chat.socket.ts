import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

export const initSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => socket.join(room));
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (message) => {
      const chat = message.chat;
      if (!chat.users) return;

      chat.users.forEach((user: any) => {
        if (user._id === message.sender._id) return;
        socket.in(user._id).emit("message received", message);
      });
    });
  });
};
