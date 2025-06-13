import express from "express";
import { ProjectController } from "./project.controller";
const router = express.Router();

router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getAllProjects);
router.get("/:projectId", ProjectController.getProjectById);
router.patch("/:projectId", ProjectController.updateProject);
router.patch("/:projectId/cancel", ProjectController.cancelProject);

export const ProjectRoutes = router;