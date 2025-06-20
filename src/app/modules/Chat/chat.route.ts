import express from "express";
import { TeamChatControllers } from "./chat.controller";
import auth from "../../middlewares/auth";


const router = express.Router();

router.post("/", TeamChatControllers.createTeamChatController)
router.get("/:teamId",
    auth("admin", "teamLeader", "teamColeader", "teamMember"),
    TeamChatControllers.getTeamChatByTeamIdController);

export const ChatRoutes = router;