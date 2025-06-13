import { model, Schema } from "mongoose";
import { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: [true, "Project ID is required"],
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
    },
    station: {
      type: String,
      required: [true, "Station name / Project source is required"],
    },
    clientId: {
      type: String,
      required: [true, "Client ID is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    cancellationNote: {
      type: String,
      default: null
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
    },
    frontendRoleAssignedTo: {
      type: String,
    },
    backendRoleAssignedTo: {
      type: String,
    },
    uiRoleAssignedTo: {
      type: String,
    },
    lastUpdate: {
      type: Date,
    },
    lastMeeting: {
      type: Date,
    },
    projectStatus: {
      type: String,
      enum: ["ui/ux", "wip", "new", "qa", "delivered", "revision"],
      default: "new",
      required: [true, "Project status is required"],
    },
    estimatedDelivery: {
      type: String,
      enum: ["thisMonth", "thisWeek", "nextMonth"],
      required: [true, "Estimated delivery is required"],
    },
    rating: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "noRating"],
      default: "noRating",
    },
    clientStatus: {
      type: String,
      enum: ["active", "inactive", "satisfied", "unsatisfied", "angry", "neutral"],
      default: "neutral",
    },
    figmaLink: {
      type: String,
    },
    backendLink: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    deliveryDate: {
      type: Date,
    },
    requirementDoc: {
      type: String,
    },
    notes: [
      {
        noteProvider: {
          type: String,
        },
        noteText: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const ProjectModel = model<IProject>("Project", projectSchema);