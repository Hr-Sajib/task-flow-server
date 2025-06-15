import { Model } from 'mongoose';

export type TTeam = {
  teamName: string;
  teamID: string;
  teamLeaderEmail: string;
  teamColeaderEmail?: string;
  teamMembersEmails: string[];
};

export interface TeamModel extends Model<TTeam> {
  isTeamExistById(id: string): Promise<TTeam | null>;
}
