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

export const UserValidations = {
  createUserValidationSchema,
};