import express from 'express';
import { TeamControllers } from './team.controller';

const router = express.Router();

router.post("/", TeamControllers.createTeam)

router.patch("/move-member", TeamControllers.moveMember)

export const TeamRoutes = router;