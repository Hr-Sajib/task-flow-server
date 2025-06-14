import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    userName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    userEmail: z.string().email('Invalid email format'),
    userRole: z.enum(['user', 'admin', 'teamLeader', 'teamColeader', 'teamMember', 'client'],).default('user'),
    userPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    userName: z.string().min(2).max(50).optional(),
    oldPassword: z.string().min(6, 'Old password is required').optional(),
    newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    photo: z.string().optional(),
  })
    .refine((data) => {
      if (data.oldPassword && !data.newPassword) return false;
      if (!data.oldPassword && data.newPassword) return false;
      return true;
    }, {
      message: 'Both oldPassword and newPassword must be provided together',
      path: ['newPassword'],
    })
});


export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema
};