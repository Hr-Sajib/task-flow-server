import config from "../../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../User/user.model";
import { createToken, verifyToken } from "../../utils/auth.utils";

const loginUserIntoDB = async (payload: { userEmail: string; userPassword: string }) => {
  // Check if user exists with email
  const user = await User.findOne({ userEmail: payload.userEmail }).select("+userPassword");

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(payload.userPassword, user.userPassword);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  // Create JWT tokens
  const jwtPayload = {
    userEmail: user.userEmail,
    userEmployeeId: user.userEmployeeId as string,
    role: user.userRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};




const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

  console.log("decoded: ",decoded)


  // checking if the user is exist
  const user = await User.findOne({ userEmail: userEmail }).select("+userPassword");

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }


  const jwtPayload = {
    userEmail: user.userEmail,
    userEmployeeId: user.userEmployeeId as string,
    role: user.userRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};




export const authServices = {
  loginUserIntoDB,
  refreshToken
};
