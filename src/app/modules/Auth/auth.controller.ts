import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import config from "../../../config";

const loginUser = catchAsync(async(req, res)=>{
  const result = await authServices.loginUserIntoDB(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production' ? true : false, // Secure in production only
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken
    },
  });

})

const refreshToken = catchAsync(async (req, res) => {

  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken
}
