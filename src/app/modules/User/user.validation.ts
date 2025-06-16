import { z } from "zod";

const userRoles = ["user", "admin", "teamLeader", "teamColeader", "teamMember", "client"] as const;

const createUserValidationSchema = z.object({
  body: z.object({
    userName: z
      .string({ required_error: "Username is required" })
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),

    userEmail: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),

    userRole: z.enum(userRoles, {
      required_error: "User role is required",
    }),

    userJoiningDate: z
      .string({ required_error: "Joining date is required" })
      .refine((val) => /^(\d{2})-(\d{2})-(\d{4})$/.test(val), {
        message: "Joining date must be in DD-MM-YYYY format",
      }),

    userPassword: z
      .string({ required_error: "Password is required" })
      .min(4, "Password must be at least 4 characters long"),

    userEmployeeId: z
      .string({ required_error: "Employee ID is required" })
      .regex(/^EMP\d{3}$/, {
        message: "Employee ID must be in the format 'EMP' followed by 3 digits (e.g., EMP123)",
      }),

    address: z
      .string()
      .min(10, "Address must be at least 10 characters")
      .max(40, "Address must be at most 40 characters")
      .optional(),

    phone: z
      .string()
      .min(8, "Phone number must be at least 8 characters long")
      .optional(),

    photo: z.string().optional(),
  }),
});


const updateUserValidationSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .optional(),

  userEmail: z
    .string()
    .email("Invalid email format")
    .optional(),

  userRole: z.enum(userRoles).optional(),

  userJoiningDate: z
    .string()
    .refine((val) => {
      if (!val) return true;
      return /^(\d{2})-(\d{2})-(\d{4})$/.test(val);
    }, {
      message: "Joining date must be in DD-MM-YYYY format",
    })
    .optional(),

  userPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),

  userEmployeeId: z
    .string()
    .regex(/^EMP\d{3}$/, {
      message: "Employee ID must be in the format 'EMP' followed by 3 digits (e.g., EMP123)",
    })
    .optional(),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(40, "Address must be at most 40 characters")
    .optional(),

  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters long")
    .optional(),

  photo: z.string().optional(),
});


export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
