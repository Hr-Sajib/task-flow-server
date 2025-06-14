import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import { ProjectRoutes } from "./app/modules/project/project.route";
import { TeamRoutes } from "./app/modules/Team/team.routes";

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
app.use("/api/team", TeamRoutes)

// Global error handler
app.use(globalErrorHandler);

export default app;
