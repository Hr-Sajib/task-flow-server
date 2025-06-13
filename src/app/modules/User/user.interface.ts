import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = keyof typeof USER_ROLE;

export type TUser = {
  userName: string;
  userEmail: string;
  userRole: TUserRole;
  userPassword: string;
  userEmployeeId?: string;
  address?: string;
  phone?: string;
  photo?: string;
};

export interface UserModel extends Model<TUser> {
  isUserExist(name: string, email: string): boolean;
  isUserExistByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

