import mongoose from "mongoose";
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

  const moveTeamMemberFromDB = async (payload: { memberEmail: string; toTeamName: string }) => {
    const { memberEmail, toTeamName } = payload;
  
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
  
      // Check if user exists
      const user = await User.findOne({ userEmail: memberEmail }).session(session);
      if (!user) {
        throw new Error(`User with email "${memberEmail}" not found.`);
      }
  
      // Find the target team
      const toTeam = await Team.findOne({ teamName: toTeamName }).session(session);
      if (!toTeam) {
        throw new Error(`Destination team "${toTeamName}" not found.`);
      }
  
      // Check if user is already in target team
      if (toTeam.teamMembersEmails.includes(memberEmail)) {
        throw new Error(`User "${memberEmail}" is already a member of team "${toTeamName}".`);
      }
  
      // Remove user from any existing team
      await Team.updateMany(
        { teamMembersEmails: memberEmail },
        { $pull: { teamMembersEmails: memberEmail } },
        { session }
      );
  
      // Add user to new team
      toTeam.teamMembersEmails.push(memberEmail);
      await toTeam.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      return { message: `Member "${memberEmail}" moved to team "${toTeamName}" successfully.` };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };
  
  

export const TeamServices = {createTeamIntoDB, moveTeamMemberFromDB}