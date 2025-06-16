import express from 'express';
   import { UserControllers } from './user.controller';
   import validateRequest from '../../middlewares/validateRequest';
   import { UserValidations } from './user.validation';

   const router = express.Router();

   router.post(
     '/',
     validateRequest(UserValidations.createUserValidationSchema),
     UserControllers.createUser,
   );

   router.get("/", UserControllers.getAllUsers);

   router.get("/:id", UserControllers.getSingleUser);

   router.delete('/:id', UserControllers.deleteUser);

   router.patch(
     '/update-user',
     validateRequest(UserValidations.updateUserValidationSchema),
     UserControllers.updateUser,
   );

   export const UserRoutes = router;