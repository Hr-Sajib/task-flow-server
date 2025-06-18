import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import { ProjectRoutes } from "./app/modules/Project/project.route";
import { TeamRoutes } from "./app/modules/Team/team.routes";
import { ChatRouteoute } from "./app/modules/Chat/chat.route";
import { MessageRoute } from "./app/modules/Message/message.route";
import { PaymentRoutes } from "./app/modules/Payment/payment.route";

const app: Application = express();

// CORS - Allow access from anywhere
app.use(cors({ origin: "*", credentials: true }));

// Body and cookie parser
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("TaskFlow server running ..");
});

// Application routes
app.use("/api/project", ProjectRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/chat", ChatRouteoute);
app.use("/api/message", MessageRoute);
app.use("/api/team", TeamRoutes)
app.use("/api/payment", PaymentRoutes)

// Global error handler
app.use(globalErrorHandler);

export default app;
