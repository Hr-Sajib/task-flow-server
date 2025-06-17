import mongoose from "mongoose";
import { User } from "../User/user.model";
import { TTeam } from "./team.interface";
import { Team } from "./team.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ProjectModel } from "../Project/project.model";

const createTeamIntoDB = async (payload: TTeam) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      teamID,
      teamName,
      teamLeaderEmail,
      teamColeaderEmail,
      teamMembersEmails,
    } = payload;

    const isTeamExist = await Team.findOne({ teamName }).session(session);
    if (isTeamExist) {
      throw new Error(`Team with name "${teamName}" already exists.`);
    }

    const isTeamIDExist = await Team.findOne({ teamID }).session(session);
    if (isTeamIDExist) {
      throw new Error(`Team with ID "${teamID}" already exists.`);
    }

    const emailSet = new Set(teamMembersEmails);

    if (!emailSet.has(teamLeaderEmail)) {
      throw new Error(
        `Team leader email "${teamLeaderEmail}" must be in teamMembersEmails array.`
      );
    }

    if (teamColeaderEmail && !emailSet.has(teamColeaderEmail)) {
      throw new Error(
        `Team co-leader email "${teamColeaderEmail}" must be in teamMembersEmails array.`
      );
    }

    const isExistTeamLeaderEmail = await User.findOne({
      userEmail: teamLeaderEmail,
    }).session(session);
    if (!isExistTeamLeaderEmail) {
      throw new Error(
        `Team leader email "${teamLeaderEmail}" not found in database.`
      );
    }

    if (teamColeaderEmail) {
      const isExistTeamColeaderEmail = await User.findOne({
        userEmail: teamColeaderEmail,
      }).session(session);
      if (!isExistTeamColeaderEmail) {
        throw new Error(
          `Team co-leader email "${teamColeaderEmail}" not found in database.`
        );
      }
    }

    for (const memberEmail of teamMembersEmails) {
      const ExistMemberEmail = await User.findOne({
        userEmail: memberEmail,
      }).session(session);
      if (!ExistMemberEmail) {
        throw new Error(
          `Team member email "${memberEmail}" not found in database.`
        );
      }
      if(ExistMemberEmail?.userRole == "client"){
        throw new Error(
          `User with email "${memberEmail}" is a client!`
        );
      }
      if(ExistMemberEmail?.userRole !== "user"){
        throw new Error(
          `Team member "${memberEmail}" is already in a team!`
        );
      }
    }



    // Update user roles
    await User.updateOne(
      { userEmail: teamLeaderEmail },
      { $set: { userRole: "teamLeader" } },
      { session }
    );

    if (teamColeaderEmail) {
      await User.updateOne(
        { userEmail: teamColeaderEmail },
        { $set: { userRole: "teamColeader" } },
        { session }
      );
    }

    await User.updateMany(
      {
        userEmail: {
          $in: teamMembersEmails.filter(
            (email) => email !== teamLeaderEmail && email !== teamColeaderEmail
          ),
        },
      },
      { $set: { userRole: "teamMember" } },
      { session }
    );

    const newTeam = await Team.create(
      [
        {
          teamName,
          teamID,
          teamLeaderEmail,
          teamColeaderEmail,
          teamMembersEmails,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newTeam[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const moveTeamMemberFromDB = async (payload: {
  memberEmail: string;
  toTeamName: string;
}) => {
  const { memberEmail, toTeamName } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if user exists
    const user = await User.findOne({ userEmail: memberEmail }).session(
      session
    );
    if (!user) {
      throw new Error(`User with email "${memberEmail}" not found.`);
    }

    // Find the target team
    const toTeam = await Team.findOne({ teamName: toTeamName }).session(
      session
    );
    if (!toTeam) {
      throw new Error(`Destination team "${toTeamName}" not found.`);
    }

    // Check if user is already in target team
    if (toTeam.teamMembersEmails.includes(memberEmail)) {
      throw new Error(
        `User "${memberEmail}" is already a member of team "${toTeamName}".`
      );
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

    return {
      message: `Member "${memberEmail}" moved to team "${toTeamName}" successfully.`,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllTeamsFromDB = async () => {
  const result = await Team.find();

  return result;
};

const updateTeamIntoDB = async (payload: {
  currentTeamID: string;
  teamName: string;
  teamID: string;
}) => {
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

const changeLeaderFromDB = async (payload: {
  teamID: string;
  newLeaderEmail: string;
}) => {
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

const changeCoLeaderFromDB = async (payload: {
  teamID: string;
  newCoLeaderEmail: string;
}) => {
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

  return result;
};

const assignProjectToTeam = async (payload: {
  teamName: string;
  projectId: string;
}) => {
  const updatedProject = await ProjectModel.findOneAndUpdate(
    { projectId: payload.projectId },
    { teamName: payload.teamName },
    { new: true } // return the updated document
  );
  return updatedProject;
};

export const TeamServices = {
  createTeamIntoDB,
  moveTeamMemberFromDB,
  getAllTeamsFromDB,
  updateTeamIntoDB,
  changeLeaderFromDB,
  changeCoLeaderFromDB,
  deleteTeamFromDB,
  assignProjectToTeam,
};
