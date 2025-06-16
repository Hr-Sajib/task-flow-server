import { Request, Response } from "express";
import httpStatus from "http-status";
import { ProjectService } from "./project.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const project = req.body;
  const result = await ProjectService.createProjectIntoDB(project);

  if(!result){
    throw new AppError(httpStatus.BAD_REQUEST, "Project not created!");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project is created successfully.",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getAllProjectsFromDB(req.query);

  if(!result){
    throw new AppError(httpStatus.BAD_REQUEST, "Projects not read!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects are retrieved successfully.",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;

  const result = await ProjectService.getProjectByIdFromDB(projectId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `No project found with ID: ${projectId}`);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single project retrieved successfully.",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const updatedData = req.body;

  const project = await ProjectService.getProjectByIdFromDB(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, `No project found with ID: ${projectId}`);
  }

  const updatedProject = await ProjectService.updateProjectInDB(projectId, updatedData);
  if (!updatedProject) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Project not updated");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
});

const cancelProject = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const { cancellationNote } = req.body;

  if (!cancellationNote) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cancellation note is required");
  }

  const project = await ProjectService.getProjectByIdFromDB(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, `No project found with ID: ${projectId}`);
  }

  const result = await ProjectService.cancelProjectInDB(projectId, cancellationNote);
  if (!result) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Project cancellation failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project canceled successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  cancelProject,
};
