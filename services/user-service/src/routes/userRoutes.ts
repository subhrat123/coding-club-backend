import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile/:id", authMiddleware, updateProfile);


export default router;
