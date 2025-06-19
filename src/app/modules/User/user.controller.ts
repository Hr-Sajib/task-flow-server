import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { User } from "./user.model";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await UserServices.createUserIntoDB(body);

  console.log("User data in controller: ", req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User created successfsully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User fetched successfsully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single user fetched successfsully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const employeeId = req.params.employeeId;
  const updatePayload = req.body;

  const existingUser = await User.findOne({
    userEmployeeId: employeeId,
  }).select("+userPassword");
  if (!existingUser) {
    throw new Error("User not found");
  }

  if (user?.role !== "admin") {
    if (user?.userEmail !== existingUser?.userEmail) {
      throw new Error("You can not update other users information!");
    } else {
      const result = await UserServices.updateUserProfileintoDB(
        employeeId,
        updatePayload
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Single updated successfsully",
        data: result,
      });
    }
  } else {
    const result = await UserServices.updateUserProfileintoDB(
      employeeId,
      updatePayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single updated successfsully",
      data: result,
    });
  }
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfsully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  const result = await UserServices.changePassword(user, {
    oldPassword,
    newPassword,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getSingleUser,
  changePassword,
};
