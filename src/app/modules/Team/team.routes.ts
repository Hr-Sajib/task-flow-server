import express from 'express';
import { TeamControllers } from './team.controller';

const router = express.Router();

router.post("/", TeamControllers.createTeam)

export const TeamRoutes = router;