import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import config from '../../../config';
import { User } from './user.model';

const createUserIntoDB = async (payLoad: TUser) => {
  const {
    userName,
    userEmail,
    userEmployeeId,
    address,
    phone,
    photo,
  } = payLoad;


  const checkExistingUser = await User.isUserExist(userName, userEmail);

  if (checkExistingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This name or email is already in use for this web',
    );
  }

 
  payLoad.userPassword =
    payLoad.userPassword || (config.default_password as string);


  const userData = {
    userName,
    userEmail,
    userRole: payLoad.userRole,
    userPassword: payLoad.userPassword,
    employeeId: userEmployeeId,
    address,
    phone,
    photo,
  };

  const createdUser = await User.create(userData);

 
  const userObj = createdUser.toObject() as any;
  delete userObj.userPassword;

  return userObj;
};


const updateUserIntoDB = async () => {}

// const loginUserFromDB = async (payLoad: TUser) => {
//   const user = await User.isUserExistByEmail(payLoad?.email);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User is already deleted');
//   }

//   const isPassowrdMatched = await User.isPasswordMatched(
//     payLoad?.password,
//     user?.password,
//   );
//   if (!isPassowrdMatched) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Password not matched');
//   }

//   const jwtPayLoad = { email: user?.email, userRole: user?.role, user: user };
//   const accessToken = createToken(
//     jwtPayLoad,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   return { user, accessToken };
// };

// const changePasswordFromDB = async (
//   user: JwtPayload,
//   payLoad: { oldPassword: string; newPassword: string },
// ) => {
//   console.log('From auth service:', user);
//   console.log('From auth service:', payLoad);
//   const userInfo = await User.isUserExistByEmail(user?.email);
//   if (!userInfo) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const isDeleted = userInfo?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
//   }

//   const isPasswordMatched = await User.isPasswordMatched(
//     payLoad?.oldPassword,
//     userInfo?.password,
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Password do not matched');
//   }
//   const newHashedPassword = await bcrypt.hash(
//     payLoad?.newPassword,
//     Number(config.brypt_salt_rounds),
//   );

//   const result = await User.findOneAndUpdate(
//     { email: user?.email, role: user?.userRole },
//     {
//       password: newHashedPassword,
//       passwordChangedAt: new Date(),
//     },
//   );

//   return result;
// };

// const refreshToken = async (token: string) => {
//   const decoded = verifyToken(token, config.jwt_refresh_secret as string);

//   const { email, iat } = decoded;

//   const userInfo = await User.isUserExistByEmail(email);
//   if (!userInfo) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const isDeleted = userInfo?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
//   }

//   if (
//     userInfo?.passwordChangedAt &&
//     User?.isJWTIssuedBeforePasswordChange(
//       userInfo?.passwordChangedAt,
//       iat as number,
//     )
//   ) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//   }

//   const jwtPayLoad = {
//     email: userInfo?.email,
//     userRole: userInfo?.role,
//   };
//   const accessToken = createToken(
//     jwtPayLoad,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   return { accessToken };
// };

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB
};