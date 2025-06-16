import { z } from "zod";

const userRoles = ["user", "admin", "teamLeader", "teamColeader", "teamMember", "client"] as const;

const createUserValidationSchema = z.object({
  body: z.object({
  userName: z.string().optional(),
  userEmail: z.string().email("Invalid email format").optional(),
  userRole: z.enum(userRoles).optional(),
  userJoiningDate: z.string().refine((val) => {
    if (!val) return true; // Allow empty or undefined
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    return dateRegex.test(val);
  }, { message: "Joining date must be in DD-MM-YYYY format" }),
  userPassword: z.string().min(4, "Password must be at least 4 characters long").optional(),
  userEmployeeId: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
})});

const updateUserValidationSchema = z.object({
  userName: z.string().optional(),
  userEmail: z.string().email("Invalid email format").optional(),
  userRole: z.enum(userRoles).optional(),
  userJoiningDate: z.string().refine((val) => {
    if (!val) return true; // Allow empty or undefined
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    return dateRegex.test(val);
  }, { message: "Joining date must be in DD-MM-YYYY format" }).optional(),
  userPassword: z.string().min(6, "Password must be at least 6 characters long").optional(),
  userEmployeeId: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};