// export default auth;
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import config from "../../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/User/user.interface";
import catchAsync from "../utils/catchAsync";
import { User } from "../modules/User/user.model";


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

    console.log("decoded in auth: ",decoded)
 
    // Check if user exists
    const user = await User.findOne({ userEmail: userEmail }).select("+userPassword");
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
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