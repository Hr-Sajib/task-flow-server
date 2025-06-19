import express from "express";
import { TeamChatControllers } from "./chat.controller";


const router = express.Router();

router.post("/", TeamChatControllers.createTeamChatController)
router.get("/:teamId", TeamChatControllers.getTeamChatByTeamIdController);

export const ChatRoutes = router;