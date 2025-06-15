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
  
  const getAllTeamsFromDB = async () => {
    const result = await Team.find()

    return result
  }

  const updateTeamIntoDB = async (payload: { currentTeamID: string; teamName: string; teamID: string }) => {
    const { currentTeamID, teamName, teamID } = payload;
  
    // Check if the team exists using currentTeamID
    const existingTeam = await Team.findOne({ teamID: currentTeamID });
    if (!existingTeam) {
      throw new Error(`Team with teamID "${currentTeamID}" not found.`);
    }
  
    // Check if the new teamName is taken by another team
    const isNameTaken = await Team.findOne({
      teamName,
      _id: { $ne: existingTeam._id },
    });
    if (isNameTaken) {
      throw new Error(`Team name "${teamName}" is already taken.`);
    }
  
    // Check if the new teamID is taken by another team
    const isTeamIDTaken = await Team.findOne({
      teamID,
      _id: { $ne: existingTeam._id },
    });
    if (isTeamIDTaken) {
      throw new Error(`Team ID "${teamID}" is already taken.`);
    }
  
    // Perform the update
    const updatedTeam = await Team.findOneAndUpdate(
      { teamID: currentTeamID },
      { teamName, teamID },
      { new: true, runValidators: true }
    );
  
    return updatedTeam;
  };

  const changeLeaderFromDB = async (payload: { teamID: string; newLeaderEmail: string }) => {
    const { teamID, newLeaderEmail } = payload;
  
    // Check if the team exists
    const team = await Team.findOne({ teamID });
    if (!team) {
      throw new Error(`Team with ID "${teamID}" not found.`);
    }
  
    // Check if the new leader exists in User DB
    const user = await User.findOne({ userEmail: newLeaderEmail });
    if (!user) {
      throw new Error(`User with email "${newLeaderEmail}" not found.`);
    }
  
    if (team.teamLeaderEmail === newLeaderEmail) {
      throw new Error(`"${newLeaderEmail}" is already the team leader.`);
    }
  
    // Update leader 
    team.teamLeaderEmail = newLeaderEmail;
    const updatedTeam = await team.save();
  
    return updatedTeam;
  };  
  
  const changeCoLeaderFromDB = async (payload: { teamID: string; newCoLeaderEmail: string }) => {
    const { teamID, newCoLeaderEmail } = payload;
  
    // Check if the team exists
    const team = await Team.findOne({ teamID });
    if (!team) {
      throw new Error(`Team with ID "${teamID}" not found.`);
    }
  
    // Check if user with provided email exists
    const user = await User.findOne({ userEmail: newCoLeaderEmail });
    if (!user) {
      throw new Error(`User with email "${newCoLeaderEmail}" not found.`);
    }
  
    if (team.teamLeaderEmail === newCoLeaderEmail) {
      throw new Error(`"${newCoLeaderEmail}" is already the team leader.`);
    }

    if (team.teamColeaderEmail === newCoLeaderEmail) {
      throw new Error(`"${newCoLeaderEmail}" is already the team co-leader.`);
    }
  
    // Update co-leader
    team.teamColeaderEmail = newCoLeaderEmail;
    const updatedTeam = await team.save();
  
    return updatedTeam;
  };
  
 
  const deleteTeamFromDB = async (id: string) => {
    const result = await Team.deleteOne({ _id: id });

    return result
  }

export const TeamServices = {createTeamIntoDB, moveTeamMemberFromDB, getAllTeamsFromDB,updateTeamIntoDB, changeLeaderFromDB, changeCoLeaderFromDB, deleteTeamFromDB}