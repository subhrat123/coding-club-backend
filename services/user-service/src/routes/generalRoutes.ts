import { Router } from "express";
import { createOrUpdateSubscription, getSubscription } from "../controllers/generalController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createOrUpdateSubscription);
router.get("/:memberId", authMiddleware, getSubscription);

export default router;
