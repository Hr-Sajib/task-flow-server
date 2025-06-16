import express from 'express';
   import { UserControllers } from './user.controller';
   import validateRequest from '../../middlewares/validateRequest';
   import { UserValidations } from './user.validation';
import auth from '../../middlewares/auth';

   const router = express.Router();

   router.post(
     '/',
    //  auth("admin"),
     validateRequest(UserValidations.createUserValidationSchema),
     UserControllers.createUser,
   );

   router.get("/",
    // auth("admin"),
    UserControllers.getAllUsers);

   router.get("/:id",
      // auth("user", "admin", "teamLeader", "teamColeader", "teamMember", "client"),
     UserControllers.getSingleUser);

   router.delete('/:id',
      // auth("admin"),
    UserControllers.deleteUser);

   router.patch(
     '/update-user',
      // auth("user", "admin", "teamLeader", "teamColeader", "teamMember", "client"),
     validateRequest(UserValidations.updateUserValidationSchema),
     UserControllers.updateUser,
   );

   export const UserRoutes = router;