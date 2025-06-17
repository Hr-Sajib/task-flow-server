import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import  httpStatus  from 'http-status';
import { Request, Response } from 'express';
import { TeamServices } from "./team.service";
import { ProjectModel } from "../Project/project.model";
import AppError from "../../errors/AppError";
import { Team } from "./team.model";

const createTeam = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    const result = await TeamServices.createTeamIntoDB(body)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Team created successfsully',
      data: result,
    });
});

const moveMember = catchAsync(async (req: Request, res: Response) => {
    const result = await TeamServices.moveTeamMemberFromDB(req.body)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Member moved successfsully',
      data: result,
    });
});

const getAllTeam = catchAsync(async (req: Request, res: Response) => {
    const result = await TeamServices.getAllTeamsFromDB()
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all team successfsully!!!',
      data: result,
    });
});

const updateTeam = catchAsync(async (req: Request, res: Response) => {
    const result = await TeamServices.updateTeamIntoDB(req.body)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Team Updated successfsully!!!',
      data: result,
    });
});

const changeLeader = catchAsync(async (req: Request, res: Response) => {
    const result = await TeamServices.changeLeaderFromDB(req.body)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Leader change successfsully!!!',
      data: result,
    });
});

const changeCoLeader = catchAsync(async (req: Request, res: Response) => {
    const result = await TeamServices.changeCoLeaderFromDB(req.body)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Co-leader change successfsully!!!',
      data: result,
    });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const result = await TeamServices.deleteTeamFromDB(id)
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Team deleted successfsully!!!',
      data: result,
    });
});


const assignProjectToTeam = catchAsync(async (req: Request, res: Response) => {
  const { teamName, projectId } = req.body;

  if (!teamName || !projectId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Team name and Project ID are required!");
  }
  
  
  const existingProject = await ProjectModel.findOne({ projectId: projectId }).exec();
  
  if (!existingProject) {
    throw new AppError(httpStatus.BAD_REQUEST, `Project with projectId '${projectId}' doesn't exist!`);

  }
  const existingTeam = await Team.findOne({ teamName: teamName }).exec();
  
  if (!existingTeam) {
    throw new AppError(httpStatus.BAD_REQUEST, `Team with name '${teamName}' doesn't exist!`);
  }

  const result = await TeamServices.assignProjectToTeam({ teamName, projectId });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `Project assignment to team unsuccessful!`);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project assigned to team successfully",
    data: result,
  });
});

export const TeamControllers = {createTeam, moveMember, getAllTeam, updateTeam, changeLeader,changeCoLeader, deleteTeam,  assignProjectToTeam,
}