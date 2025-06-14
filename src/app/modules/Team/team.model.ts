import { Schema, model } from 'mongoose';
import { TTeam, TeamModel } from './team.interface';

const teamSchema = new Schema<TTeam, TeamModel>(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
    },
    teamLeaderEmail: {
      type: String,
      required: [true, 'Team leader email is required'],
    },
    teamColeaderEmail: {
      type: String,
      default: null,
    },
    teamMembersEmails: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.statics.isTeamExistById = async function (id: string) {
  return await Team.findById(id);
};

export const Team = model<TTeam, TeamModel>('Team', teamSchema);
