import { Router } from "express";
import { createTeam, getTeams, addTeamMember } from "../controllers/teamController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeams);
router.post("/add-member", authMiddleware, addTeamMember);

export default router;
