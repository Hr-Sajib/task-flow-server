import { z } from "zod";

// Zod schema for creating a project
const createProjectSchema = z.object({
  body: z.object({
    projectId: z
    .string({ required_error: "Project ID is required" })
    .regex(/^PRJ\d{3}$/, {
      message:
        "Project ID must be in the format 'PRJ' followed by 3 digits (e.g., PRJ123)",
    }),
  projectName: z.string({ required_error: "Project name is required" }),
  station: z.string({ required_error: "Station is required" }),
  clientId: z
    .string({ required_error: "Client ID is required" })
    .regex(/^CLI\d{3}$/, {
      message:
        "Client ID must be in the format 'CLI' followed by 3 digits (e.g., CLI123)",
    }),
  deadline: z
    .string({ required_error: "Deadline is required" })
<<<<<<< HEAD
    // .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    //   message:
    //     "Deadline must be a valid ISO 8601 timestamp (e.g., 2025-08-10T00:00:00.000Z)",
    // }),
  ,projectValue: z.number().min(0),
=======
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
      message:
        "Deadline must be a valid ISO 8601 timestamp (e.g., 2025-08-10T00:00:00.000Z)",
    }),
  projectValue: z.number().min(0),
>>>>>>> project and user module refactored
  cancellationNote: z.string().optional(),
  frontendRoleAssignedTo: z.string().optional(),
  backendRoleAssignedTo: z.string().optional(),
  uiRoleAssignedTo: z.string().optional(),
  lastUpdate: z.date().optional(),
  lastMeeting: z.date().optional(),
  projectStatus: z.enum(
    ["ui/ux", "wip", "new", "qa", "delivered", "revision", "cancelled"],
    {
      required_error: "Project status is required",
    }
  ).default("new"),
  estimatedDelivery: z
    .enum(["thisMonth", "thisWeek", "nextMonth"], {
      required_error: "Estimated delivery is required",
    })
    .optional(),
  rating: z.enum(["1", "2", "3", "4", "5", "noRating"]).optional(),
  clientStatus: z
    .enum([
      "active",
      "inactive",
      "satisfied",
      "unsatisfied",
      "angry",
      "neutral",
    ])
    .optional(),
  figmaLink: z.string().optional(),
  backendLink: z.string().optional(),
  liveLink: z.string().optional(),
  deliveryDate: z.date().optional(),
  requirementDoc: z.string().optional(),
  projectDescription: z
    .string()
<<<<<<< HEAD
    // .min(40, "Project description must be at least 40 characters")
    // .max(50, "Project description must be at most 50 characters")
    ,
=======
    .min(40, "Project description must be at least 40 characters")
    .max(50, "Project description must be at most 50 characters"),
>>>>>>> project and user module refactored
  notes: z
    .array(
      z.object({
        noteProvider: z.string().email("Invalid email format"),
        noteText: z.string(),
      })
    )
    .optional(),
  })
});

// Zod schema for updating a project
const updateProjectSchema = z.object({
 body: z.object({
   projectId: z
    .string({ required_error: "Project ID is required" })
    .regex(/^PRJ\d{3}$/, {
      message:
        "Project ID must be in the format 'PRJ' followed by 3 digits (e.g., PRJ123)",
    })
    .optional(),
  projectName: z.string().optional(),
  station: z.string().optional(),
    clientId: z
    .string({ required_error: "Project ID is required" })
    .regex(/^CLI\d{3}$/, {
      message:
        "Client ID must be in the format 'CLI' followed by 3 digits (e.g., CLI123)",
    }),
  deadline: z
    .string({ required_error: "Deadline is required" })
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
      message:
        "Deadline must be a valid ISO 8601 timestamp (e.g., 2025-08-10T00:00:00.000Z)",
    }).optional(),
  projectValue: z.number().min(0).optional(),
  cancellationNote: z.string().optional(),
  teamName: z.string().optional(),
  frontendRoleAssignedTo: z.string().optional(),
  backendRoleAssignedTo: z.string().optional(),
  uiRoleAssignedTo: z.string().optional(),
  lastUpdate: z.date().optional(),
  lastMeeting: z.date().optional(),
  projectStatus: z
    .enum(["ui/ux", "wip", "new", "qa", "delivered", "revision", "cancelled"])
    .optional(),
  estimatedDelivery: z.enum(["thisMonth", "thisWeek", "nextMonth"]).optional(),
  rating: z.enum(["1", "2", "3", "4", "5", "noRating"]).optional(),
  clientStatus: z
    .enum([
      "active",
      "inactive",
      "satisfied",
      "unsatisfied",
      "angry",
      "neutral",
    ])
    .optional(),
  figmaLink: z.string().optional(),
  backendLink: z.string().optional(),
  liveLink: z.string().optional(),
  deliveryDate: z.date().optional(),
  requirementDoc: z.string().optional(),
  projectDescription: z
    .string()
    .min(30, "Project description must be at least 30 characters")
    .max(40, "Project description must be at most 40 characters")
    .optional(),
  notes: z
    .array(
      z.object({
        noteProvider: z.string().email("Invalid email format"),
        noteText: z.string(),
      })
    )
    .optional(),
 })
});

export const ProjectValidation = {
  createProjectSchema,
  updateProjectSchema,
};
