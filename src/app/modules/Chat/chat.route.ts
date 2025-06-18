import { Router } from "express";


import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.accessChat);
router.get("/", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.fetchChats);
router.post("/group", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.createGroupChat);
router.put("/rename", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.renameGroup);
router.put("/groupremove", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.removeFromGroup);
router.put("/groupadd", auth("admin","client","teamColeader","teamLeader","teamMember","user"), ChatController.addToGroup);


export const ChatRouteoute = router;
