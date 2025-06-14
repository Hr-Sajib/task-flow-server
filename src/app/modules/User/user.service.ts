import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import config from "../../../config";
import { User } from "./user.model";

const createUserIntoDB = async (payLoad: TUser) => {
  const {
    userName,
    userEmail,
    userEmployeeId,
    userPassword,
    userRole,
    address,
    phone,
    photo,
  } = payLoad;

  const checkExistingUser = await User.findOne({ userEmail: userEmail });

  if (checkExistingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This email is already in use!"
    );
  }

  const checkExistingUserById = await User.findOne({
    userEmployeeId: userEmployeeId,
  });

  if (checkExistingUserById) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This employee ID is already in use!"
    );
  }

  payLoad.userPassword =
    payLoad.userPassword || (config.default_password as string);

  const userData = {
    userName,
    userEmail,
    userRole,
    userPassword,
    userEmployeeId,
    address,
    phone,
    photo,
  };

  const createdUser = await User.create(userData);

  return createdUser;
};

const getAllUsersFromDB = async() => {
  const result = await User.find();

  return result
}

const updateUserIntoDB = async () => {};

const deleteUserIntoDB = async () => {
  
};



export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getAllUsersFromDB,
  deleteUserIntoDB
};
