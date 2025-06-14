import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await UserServices.createUserIntoDB(body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User created successfsully',
    data: result,
  });
});

const getAllUsers = catchAsync(async(req:Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched successfsully',
    data: result,
  });
})

const getSingleUser = catchAsync(async(req:Request, res: Response) => {
  const {id} = req.params
  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single user fetched successfsully',
    data: result,
  });
})

const updateUser = catchAsync(async(req: Request, res: Response) => {
  const user = req.user
  const updatePayload = req.body;
  const result = await UserServices.updateUserIntoDB(user, updatePayload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single updated successfsully',
    data: result,
  });
})

const deleteUser = catchAsync(async(req: Request, res: Response) => {
  const {id} = req.params
  const result = await UserServices.deleteUserIntoDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfsully',
    data: result,
  });
})



export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getSingleUser
};