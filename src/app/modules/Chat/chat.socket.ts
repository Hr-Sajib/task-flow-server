import { Server, ServerOptions } from "socket.io";
import { TeamChatServices } from "./chat.service";

let io: Server;
/* eslint-disable @typescript-eslint/no-explicit-any */

export const initSocket = (httpServer: any) => {
  const ioOptions: Partial<ServerOptions> = {
    cors: {
      origin: (origin, callback) => {
        if (origin === "http://localhost:5173" || origin === "https://task-flow-rho-three.vercel.app") {
          callback(null, origin);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    },
    transports: ["websocket", "polling"],
  };

  io = new Server(httpServer, ioOptions);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a room based on teamName
    socket.on("joinRoom", (teamName: string) => {
      socket.join(teamName);
      console.log(`User ${socket.id} joined room: ${teamName}`);
    });

    // Handle sending a message
    socket.on("sendMessage", async (data: { teamName: string; senderEmail: string; message: string }) => {
      const { teamName, senderEmail, message } = data;
      const timestamp = new Date();

      try {
        // *** MARK: Call TeamChatServices.addMessageToTeamChat here ***
        const messageData = { timestamp, messageText: message, senderName: senderEmail.split('@')[0], senderEmail };
        await TeamChatServices.addMessageToTeamChat(teamName, messageData);

        // Emit message to all users in the room (no database for now)
        io.to(teamName).emit("receiveMessage", {
          teamName,
          sender: senderEmail.split('@')[0], // Use sender name from email for simplicity
          message,
          timestamp,
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to save message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;

// import { Server, ServerOptions } from "socket.io";

// let io: Server;

// export const initSocket = (httpServer: any) => {
//   const ioOptions: Partial<ServerOptions> = {
//     cors: {
//       origin: (origin, callback) => {
//         if (origin === "http://localhost:5173" || origin === "https://task-flow-rho-three.vercel.app") {
//           callback(null, origin);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       },
//       methods: ["GET", "POST"],
//       credentials: true,
//       allowedHeaders: ["Authorization", "Content-Type"],
//     },
//     transports: ["websocket", "polling"],
//   };

//   io = new Server(httpServer, ioOptions);

//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Join a room based on teamName
//     socket.on("joinRoom", (teamName: string) => {
//       socket.join(teamName);
//       console.log(`User ${socket.id} joined room: ${teamName}`);
//     });

//     // Handle sending a message
//     socket.on("sendMessage", (data: { teamName: string; senderEmail: string; message: string }) => {
//       const { teamName, senderEmail, message } = data;
//       const timestamp = new Date();

//       // Emit message to all users in the room (no database for now)
//       io.to(teamName).emit("receiveMessage", {
//         teamName,
//         sender: senderEmail.split('@')[0], // Use sender name from email for simplicity
//         message,
//         timestamp,
//       });
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = () => io;