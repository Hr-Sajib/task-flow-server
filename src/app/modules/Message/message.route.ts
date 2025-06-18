import { Router } from "express";
import { MessageController } from "./message.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/:chatId", auth(),  MessageController.allMessages);
router.post("/", auth("admin","client","teamColeader","teamLeader","teamMember","user"),  MessageController.sendMessage);

export const MessageRoute = router;
