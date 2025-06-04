// teamController.ts
import { RequestHandler } from "express";
import { createTeamService, getTeamsService, addTeamMemberService } from "../services/teamService";

// Create a new team.
export const createTeam: RequestHandler = async (req, res, next) => {
  try {
    const { team_name, description, img } = req.body;
    const team = await createTeamService({ team_name, description, img });
    res.status(201).json({ team });
  } catch (error: any) {
    next(error);
  }
};

// Get all teams.
export const getTeams: RequestHandler = async (req, res, next) => {
  try {
    const teams = await getTeamsService();
    res.status(200).json({ teams });
  } catch (error: any) {
    next(error);
  }
};

// Add a member to a team.
export const addTeamMember: RequestHandler = async (req, res, next) => {
  try {
    const { teamId, memberId, position, isAdmin } = req.body;
    const teamMember = await addTeamMemberService({ teamId, memberId, position, isAdmin });
    res.status(201).json({ teamMember });
  } catch (error: any) {
    next(error);
  }
};
