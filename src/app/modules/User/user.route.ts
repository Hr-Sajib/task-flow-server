import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

// router.post(
//   '/signin',
//   //validateRequest(AuthValidation.createAuthValidation),
//   UserControllers.loginUser,
// );

// router.post(
//   '/change-password',
//   //validateRequest(AuthValidation.changePasswordValidationAchema),
//   UserControllers.changePassword,
// );

// router.post(
//   '/refresh-token',
//   //validateRequest(AuthValidation.refreshTokenValidationSchema),
//   UserControllers.refreshToken,
// );

export const UserRoutes = router;