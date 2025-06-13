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

// const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.loginUserFromDB(req.body);
//   const { user, accessToken } = result;

//   const isProduction = config.NODE_ENV === 'production';

//   res.cookie('accessToken', accessToken, {
//     httpOnly: true,
//     secure: isProduction,
//     maxAge: 3600000,
//   });

//   res.cookie('user', JSON.stringify(user), {
//     httpOnly: false,
//     secure: isProduction,
//     maxAge: 3600000,
//   });

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User logged in successfsully',
//     data: { user, token: accessToken },
//   });
// });

// const changePassword = catchAsync(async (req, res) => {
//   const { ...passwordData } = req.body;
//   const result = await AuthServices.changePasswordFromDB(
//     req.user,
//     passwordData,
//   );
//   console.log('From auth controller:', result);
//   console.log('From auth controller:', passwordData);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password updated successfully',
//     data: result,
//   });
// });

// const refreshToken = catchAsync(async (req, res) => {
//   const { refereshToken } = req.cookies;
//   const result = await AuthServices.refreshToken(refereshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token is retrived successfully',
//     data: result,
//   });
// });

export const UserControllers = {
  createUser
};