import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ProjectModel } from "./project.model";
import { IProject } from "./project.interface";

const createProjectIntoDB = async (project: IProject) => {
  const existingProject = await ProjectModel.findOne({ projectId: project.projectId }).exec();
  
  if (existingProject) {
    throw new AppError(httpStatus.BAD_REQUEST, `Project with projectId '${project.projectId}' already exists.`);
  }

  const createdProject = await ProjectModel.create(project);
  return createdProject;
};

const getAllProjectsFromDB = async (query: Record<string, unknown>) => {
  try {
    const projectsQuery = new QueryBuilder(ProjectModel.find(), query)
      .search(["projectName", "station", "teamName"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await projectsQuery.modelQuery.exec();
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch projects in service`);
  }
};

const getProjectByIdFromDB = async (projectId: string) => {
  return await ProjectModel.findOne({ projectId: projectId });
};



const updateProjectInDB = async (projectId: string, updatedData: Partial<IProject>) => {
  if (
    updatedData.projectStatus === "cancelled" &&
    (!updatedData.cancellationNote || updatedData.cancellationNote.trim() === "")
  ) {
    throw new AppError(400, "Cannot cancel project without cancellation note");
  }

  return await ProjectModel.findOneAndUpdate(
    { projectId },
    { $set: updatedData },
    { new: true }
  );
};

const cancelProjectIntoDB = async (projectId: string, cancellationNote: string) => {
  const project = await ProjectModel.findOneAndUpdate(
    { projectId },
    { $set: { projectStatus: 'cancelled', cancellationNote } },
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};



export const ProjectService = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getProjectByIdFromDB,
  updateProjectInDB,
  cancelProjectIntoDB
};