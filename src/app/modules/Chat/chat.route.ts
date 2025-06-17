import { Router } from "express";


import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth(), ChatController.accessChat);
router.get("/", auth(), ChatController.fetchChats);
router.post("/group", auth(), ChatController.createGroupChat);
router.put("/rename", auth(), ChatController.renameGroup);
router.put("/groupremove", auth(), ChatController.removeFromGroup);
router.put("/groupadd", auth(), ChatController.addToGroup);


export const ChatRouteoute = router;
