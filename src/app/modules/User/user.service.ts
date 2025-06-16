import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import config from "../../../config";
import { User } from "./user.model";
import { Team } from "../Team/team.model";
import mongoose from "mongoose";

const createUserIntoDB = async (payLoad: TUser) => {
  const {
    userName,
    userEmail,
    userEmployeeId,
    userJoiningDate,
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
    userJoiningDate,
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

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};


const updateUserIntoDB = async (user: any, payload: any) => {
  const userEmail = user.userEmail;

  const {
    oldPassword,
    newPassword,
    ...restUpdate
  } = payload;

  const existingUser = await User.findOne({ userEmail }).select('+userPassword');
  if (!existingUser) {
    throw new Error('User not found');
  }

  if (oldPassword && newPassword) {
    const isMatched = await User.isPasswordMatched(
      oldPassword,
      existingUser.userPassword
    );

    if (!isMatched) {
      throw new Error('Old password is incorrect');
    }

    const bcrypt = await import('bcrypt');
    restUpdate.userPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await User.findOneAndUpdate(
    { userEmail },
    { $set: restUpdate },
    {
      new: true,
      runValidators: true,
    }
  ).select('-userPassword');

  return updatedUser;
};

// const deleteUserIntoDB = async (id: string) => {
//   const result = await User.deleteOne({ _id: id });
//   return result;
// };

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
        $or: [
          { teamLeaderEmail: userEmail },
          { teamColeaderEmail: userEmail },
        ],
      },
      [
        {
          $set: {
            teamLeaderEmail: {
              $cond: [{ $eq: ["$teamLeaderEmail", userEmail] }, null, "$teamLeaderEmail"],
            },
            teamColeaderEmail: {
              $cond: [{ $eq: ["$teamColeaderEmail", userEmail] }, null, "$teamColeaderEmail"],
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
  updateUserIntoDB,
  getAllUsersFromDB,
  deleteUserIntoDB,
  getSingleUserFromDB
};
