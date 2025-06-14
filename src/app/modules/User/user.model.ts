import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    userName: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    userRole: { type: String, enum: ['user', 'admin', 'teamLeader', 'teamColeader', 'teamMember', 'client'], default: 'user' },
    userPassword: {
      type: String,
      required: [true, 'Password is required'],
    },
    userEmployeeId: {
        type: String,
        unique: true,
        sparse: true, 
      },
      
      address: {
        type: String,
      },
      
      phone: {
        type: String,
        unique: true,
        sparse: true,
      },
      
      photo: {
        type: String,
      },       
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const userInfo = this;
  userInfo.userPassword = await bcrypt.hash(
    userInfo.userPassword,
    Number(config.brypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.userPassword = '';

  next();
});

userSchema.statics.isUserExist = async function (name: string, email: string) {
  return await User.findOne({ name, email });
};

userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+userPassword');
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangeTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);