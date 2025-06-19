import express from 'express';
import { TeamControllers } from './team.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post("/", TeamControllers.createTeam)

router.get("/", TeamControllers.getAllTeam)

router.patch("/move-member", TeamControllers.moveMember)

router.patch("/", 
    // auth('admin'), 
    TeamControllers.updateTeam)

router.patch("/change-leader",
    //  auth('admin'), 
     TeamControllers.changeLeader)

router.patch("/change-coleader", 
    // auth('admin', 'teamLeader'), 
    TeamControllers.changeCoLeader)

router.patch("/assign-project", 
    // auth('admin'), 
    TeamControllers.assignProjectToTeam)

router.delete("/:id",  
    // auth('admin'), 
    TeamControllers.deleteTeam)

export const TeamRoutes = router;