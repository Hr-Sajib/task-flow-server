import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { get } from 'http';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.get("/", UserControllers.getAllUsers);

//router.delete('/', )

router.patch('/update-user', validateRequest(UserValidations.updateUserValidationSchema), UserControllers.updateUser)

export const UserRoutes = router;