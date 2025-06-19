import { model, Schema } from "mongoose";
import { IProject } from "../project/project.interface";

const projectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: [true, "Project ID is required"],
      unique: true,
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
    projectValue: {
      type: Number,
      required: [true, "Project value ammount is required"],
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    cancellationNote: {
      type: String,
      default: null,
    },
    teamName: {
      type: String,
      default: null,
    },
    frontendRoleAssignedTo: {
      type: String,
      default: null,
    },
    backendRoleAssignedTo: {
      type: String,
      default: null,
    },
    uiRoleAssignedTo: {
      type: String,
      default: null,
    },
    lastUpdate: {
      type: Date,
      default: null,
    },
    lastMeeting: {
      type: Date,
      default: null,
    },
    projectStatus: {
      type: String,
      enum: ["ui/ux", "wip", "new", "qa", "delivered", "revision", "cancelled"],
      default: "new",
    },
    estimatedDelivery: {
      type: String,
      enum: ["thisMonth", "thisWeek", "nextMonth"],
      default: null,
    },
    rating: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "noRating"],
      default: null,
    },
    clientStatus: {
      type: String,
      enum: [
        "active",
        "inactive",
        "satisfied",
        "unsatisfied",
        "angry",
        "neutral",
      ],
      default: null,
    },
    figmaLink: {
      type: String,
      default: null,
    },
    backendLink: {
      type: String,
      default: null,
    },
    liveLink: {
      type: String,
      default: null,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
    requirementDoc: {
      type: String,
      default: null,
    },
    notes: {
      type: [
        {
          noteProvider: {
            type: String,
          },
          noteText: {
            type: String,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const ProjectModel = model<IProject>("Project", projectSchema);
