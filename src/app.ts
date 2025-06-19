import express, { Application, Request, Response, NextFunction } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import cookieParser from "cookie-parser";
import { ChatRoutes } from "./app/modules/Chat/chat.route";
import { ProjectRoutes } from "./app/modules/Project/project.route";
import { TeamRoutes } from "./app/modules/Team/team.routes";
import { PaymentRoutes } from "./app/modules/Payment/payment.route";

const app: Application = express();

// Custom CORS middleware to handle any origin with credentials
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  // Allow the request origin or fall back to a default if not present
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Default for local testing
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return; // Ensure the function exits after handling OPTIONS
  }

  next();
});

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
app.use("/api/chat", ChatRoutes);
app.use("/api/team", TeamRoutes);
app.use("/api/payment", PaymentRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;