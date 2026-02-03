import express from "express";
import {
  improveExperienceController,
  generateSummaryController,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/improve-experience", improveExperienceController);
router.post("/generate-summary", generateSummaryController);

export default router;
