// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../../config";
// import catchAsync from "../../utils/catchAsync";
// import AppError from "../errors/AppError";
// import { TUserRole } from "../modules/User/user.interface";
// import { UserModel } from "../modules/User/user.model";

// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
//     }

//     // checking if the given token is valid
//     const decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string
//     ) as JwtPayload;

//     const { role, userEmail } = decoded;
//     // console.log("from auth : ",decoded)

//     // checking if the user is exist
//     const user = await UserModel.isUserExistsByEmail(userEmail);

//     if (!user) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         "User is not found. Login using correct credentials!"
//       );
//     }
//     // checking if the user is already deleted

//     const isDeleted = user?.isDeleted;

//     if (isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
//     }

//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
//     }

//     req.user = decoded as JwtPayload & { role: string };
//     next();
//   });
// };

// export default auth;
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/User/user.interface";
import { UserModel } from "../modules/User/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    // Normalize token (handle "Bearer <token>" or raw token)
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "No authorization token provided");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7); // Remove "Bearer " prefix
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
      }
      throw new AppError(httpStatus.UNAUTHORIZED, "Token verification failed");
    }

    const { role, userEmail } = decoded;

    // Check if user exists
    const user = await UserModel.isUserExistsByEmail(userEmail);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    }

    // Check role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Insufficient role permissions");
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;