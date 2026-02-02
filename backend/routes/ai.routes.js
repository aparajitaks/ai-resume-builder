import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import aiController from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/summary", authMiddleware, aiController.generateSummaryController);
router.post("/experience", authMiddleware, aiController.improveExperienceController);

export default router;
