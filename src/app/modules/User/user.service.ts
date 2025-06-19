/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import config from "../../../config";
import { User } from "./user.model";
import { Team } from "../Team/team.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payLoad: TUser) => {
  const {
    userName,
    userEmail,
    userEmployeeId,
    userJoiningDate,
    userPassword,
    userRole,
    address,
    userPhone,
    photo,
  } = payLoad;

  const checkExistingUser = await User.findOne({ userEmail: userEmail });

  if (checkExistingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "This email is already in use!");
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
    userJoiningDate,
    userPassword,
    userEmployeeId,
    address,
    userPhone,
    photo,
  };

  const createdUser = await User.create(userData);

  return createdUser;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({ userEmployeeId: id });
  return result;
};

const updateUserProfileintoDB = async (employeeId: string, payload: any) => {
  // Extract fields to update, excluding password and email
  const {
    employeeId: payloadEmployeeId,
    userEmail: payloadEmail,
    userPassword,
    ...restUpdate
  } = payload;

  console.log(payloadEmployeeId, payloadEmail,userPassword)
  const updatedUser = await User.findOneAndUpdate(
    { employeeId },
    { $set: restUpdate },
    {
      new: true,
      runValidators: true,
    }
  ).select("-userPassword");

  return updatedUser;
};

const changePassword = async (user: any, payload: any) => {
  const userEmail = user?.userEmail;
  const { oldPassword, newPassword } = payload;

  const existingUser = await User.findOne({ userEmail }).select(
    "+userPassword"
  );
  if (!existingUser) {
    throw new Error("User not found");
  }

  if (!oldPassword || !newPassword) {
    throw new Error("Old password and new password are required");
  }

  if (user?.role == "admin") {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { userEmail },
      { $set: { userPassword: hashedPassword } },
      {
        new: true,
        runValidators: true,
      }
    ).select("-userPassword");

    return updatedUser;
  } else {
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.userPassword
    );

    if (!isOldPasswordCorrect) {
      throw new AppError(401, "Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { userEmail },
      { $set: { userPassword: hashedPassword } },
      {
        new: true,
        runValidators: true,
      }
    ).select("-userPassword");

    return updatedUser;
  }
};

const deleteUserIntoDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(id).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const userEmail = user.userEmail;

    await Team.updateMany(
      {
        $or: [{ teamLeaderEmail: userEmail }, { teamColeaderEmail: userEmail }],
      },
      [
        {
          $set: {
            teamLeaderEmail: {
              $cond: [
                { $eq: ["$teamLeaderEmail", userEmail] },
                null,
                "$teamLeaderEmail",
              ],
            },
            teamColeaderEmail: {
              $cond: [
                { $eq: ["$teamColeaderEmail", userEmail] },
                null,
                "$teamColeaderEmail",
              ],
            },
          },
        },
      ],
      { session }
    );

    // Remove from teamMembersEmails
    await Team.updateMany(
      {
        teamMembersEmails: userEmail,
      },
      {
        $pull: {
          teamMembersEmails: userEmail,
        },
      },
      { session }
    );

    // Delete the user
    const result = await User.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const UserServices = {
  createUserIntoDB,
  updateUserProfileintoDB,
  changePassword,
  getAllUsersFromDB,
  deleteUserIntoDB,
  getSingleUserFromDB,
};
