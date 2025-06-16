import express from "express";
import { ChatController } from "./chat.controller";

const router = express.Router();

router.get("/:teamId/history", ChatController.getChatHistory);

export const ChatRoutes = router;