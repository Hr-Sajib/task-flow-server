import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import { ProjectRoutes } from "./app/modules/Project/project.route";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
// import cors from "cors";
const app: Application = express();

// parser
  app.use(express.json());
  // app.use(cors({origin: [
  //     "http://localhost:5173",  // Local development
  //     "https://bicycle-store-client-one.vercel.app",  // Vercel frontend
  //   ], credentials: true}));

// application routes 
   

app.get("/", (req: Request, res: Response) => {
  res.send("TaskFlow server running ..");
});


app.use("/api/project", ProjectRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);

app.use(globalErrorHandler);


export default app;
