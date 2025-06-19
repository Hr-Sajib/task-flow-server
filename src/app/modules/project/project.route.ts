import express from "express";
import { ProjectController } from "../project/project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "../project/project.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/",
    auth("admin"),
    validateRequest(ProjectValidation.createProjectSchema), ProjectController.createProject);


router.get("/",
    auth("admin"),
     ProjectController.getAllProjects);


router.get("/:projectId",
    auth("admin", "teamLeader", "teamColeader", "teamMember"),
     ProjectController.getProjectById);

router.patch("/:projectId",
    auth("admin", "teamLeader", "teamColeader"),
    ProjectController.updateProject);

router.patch("/:projectId/cancel",
    auth("admin"),
    ProjectController.cancelProject);


export const ProjectRoutes = router;