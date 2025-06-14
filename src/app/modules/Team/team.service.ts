import { User } from "../User/user.model";
import { TTeam } from "./team.interface";
import { Team } from "./team.model";

const createTeamIntoDB = async (payload: TTeam) => {
    const { teamName, teamLeaderEmail, teamColeaderEmail, teamMembersEmails } = payload;
  
    const isTeamExist = await Team.findOne({ teamName });
    if (isTeamExist) {
      throw new Error(`Team with name "${teamName}" already exists.`);
    }
  
    const emailSet = new Set(teamMembersEmails);
    if (emailSet.has(teamLeaderEmail)) {
      throw new Error("Team leader's email cannot be in team members list.");
    }
    if (teamColeaderEmail && emailSet.has(teamColeaderEmail)) {
      throw new Error("Team co-leader's email cannot be in team members list.");
    }
  
    // Check leader email exists
    const isExistTeamLeaderEmail = await User.findOne({ userEmail: teamLeaderEmail });
    console.log(isExistTeamLeaderEmail)
    if (!isExistTeamLeaderEmail) {
      throw new Error(`Team leader email "${teamLeaderEmail}" not found in database.`);
    }
  
    // Check co-leader email exists (if provided)
    if (teamColeaderEmail) {
      const isExistTeamColeaderEmail = await User.findOne({ userEmail: teamColeaderEmail });
      if (!isExistTeamColeaderEmail) {
        throw new Error(`Team co-leader email "${teamColeaderEmail}" not found in database.`);
      }
    }
  
    // Check all team members emails exist
    for (const memberEmail of teamMembersEmails) {
      const isExistMemberEmail = await User.findOne({ userEmail: memberEmail });
      if (!isExistMemberEmail) {
        throw new Error(`Team member email "${memberEmail}" not found in database.`);
      }
    }
  
    // Create the new team after validation
    const newTeam = await Team.create({
      teamName,
      teamLeaderEmail,
      teamColeaderEmail,
      teamMembersEmails,
    });
  
    return newTeam;
  };
  
  

export const TeamServices = {createTeamIntoDB}