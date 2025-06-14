import { z } from "zod";

// Zod schema for creating a project
const createProjectSchema = z.object({
  projectId: z.string({ required_error: "Project ID is required" }),
  projectName: z.string({ required_error: "Project name is required" }),
  station: z.string({ required_error: "Station is required" }),
  clientId: z.string({ required_error: "Client ID is required" }),
  deadline: z.date({ required_error: "Deadline is required" }),
  cancellationNote: z.string().optional(),
  teamName: z.string({ required_error: "Team name is required" }),
  frontendRoleAssignedTo: z.string().optional(),
  backendRoleAssignedTo: z.string().optional(),
  uiRoleAssignedTo: z.string().optional(),
  lastUpdate: z.date().optional(),
  lastMeeting: z.date().optional(),
  projectStatus: z.enum(["ui/ux", "wip", "new", "qa", "delivered", "revision"], {
    required_error: "Project status is required",
  }),
  estimatedDelivery: z.enum(["thisMonth", "thisWeek", "nextMonth"], {
    required_error: "Estimated delivery is required",
  }).optional(),
  rating: z.enum(["1", "2", "3", "4", "5", "noRating"]).optional(),
  clientStatus: z.enum(["active", "inactive", "satisfied", "unsatisfied", "angry", "neutral"]).optional(),
  figmaLink: z.string().optional(),
  backendLink: z.string().optional(),
  liveLink: z.string().optional(),
  deliveryDate: z.date().optional(),
  requirementDoc: z.string().optional(),
  notes: z.array(
    z.object({
      noteProvider: z.string(),
      noteText: z.string(),
    })
  ).optional(),
});

// Zod schema for updating a project
const updateProjectSchema = z.object({
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  station: z.string().optional(),
  clientId: z.string().optional(),
  deadline: z.date().optional(),
  isCanceled: z.boolean().optional(),
  cancellationNote: z.string().optional(),
  teamName: z.string().optional(),
  frontendRoleAssignedTo: z.string().optional(),
  backendRoleAssignedTo: z.string().optional(),
  uiRoleAssignedTo: z.string().optional(),
  lastUpdate: z.date().optional(),
  lastMeeting: z.date().optional(),
  projectStatus: z.enum(["ui/ux", "wip", "new", "qa", "delivered", "revision"]).optional(),
  estimatedDelivery: z.enum(["thisMonth", "thisWeek", "nextMonth"]).optional(),
  rating: z.enum(["1", "2", "3", "4", "5", "noRating"]).optional(),
  clientStatus: z.enum(["active", "inactive", "satisfied", "unsatisfied", "angry", "neutral"]).optional(),
  figmaLink: z.string().optional(),
  backendLink: z.string().optional(),
  liveLink: z.string().optional(),
  deliveryDate: z.date().optional(),
  requirementDoc: z.string().optional(),
  notes: z.array(
    z.object({
      noteProvider: z.string(),
      noteText: z.string(),
    })
  ).optional(),
});

export const ProjectValidation = {
  createProjectSchema,
  updateProjectSchema,
};