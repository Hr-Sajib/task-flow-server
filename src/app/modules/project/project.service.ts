import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { ProjectModel } from "./project.model";
import { IProject } from "./project.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

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
  return await ProjectModel.findOneAndUpdate(
    { projectId: projectId },
    { $set: updatedData },
    { new: true }
  );
};

const cancelProjectInDB = async (projectId: string, cancellationNote: string) => {
  return await ProjectModel.findOneAndUpdate(
    { projectId: projectId },
    { $set: { isCanceled: true, cancellationNote } },
    { new: true }
  );
};

export const ProjectService = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getProjectByIdFromDB,
  updateProjectInDB,
  cancelProjectInDB,
};