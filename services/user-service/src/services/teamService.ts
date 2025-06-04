// teamService.ts
import { Team, TeamMember } from "../models/UserModels";

interface CreateTeamData {
  team_name: string;
  description?: string;
  img?: string;
}

interface AddTeamMemberData {
  teamId: string;
  memberId: string;
  position: string;
  isAdmin: boolean;
}

// Creates a new team with an empty members array.
export const createTeamService = async (data: CreateTeamData) => {
  const team = await Team.create({ ...data, members: [] });
  return team;
};

// Retrieves all teams.
export const getTeamsService = async () => {
  const teams = await Team.find();
  return teams;
};

// Adds a member to a team and returns the created team member document.
export const addTeamMemberService = async (data: AddTeamMemberData) => {
  const { teamId, memberId, position, isAdmin } = data;
  const teamMember = await TeamMember.create({ teamId, memberId, position, isAdmin });
  await Team.findByIdAndUpdate(teamId, { $push: { members: memberId } });
  return teamMember;
};
