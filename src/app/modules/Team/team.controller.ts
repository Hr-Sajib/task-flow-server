import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import  httpStatus  from 'http-status';
import { Request, Response } from 'express';
import { TeamServices } from "./team.service";

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

export const TeamControllers = {createTeam, moveMember}