import { Router } from "express";
import { MessageController } from "./message.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/:chatId", auth(),  MessageController.allMessages);
router.post("/", auth(),  MessageController.sendMessage);

export const MessageRoute = router;
