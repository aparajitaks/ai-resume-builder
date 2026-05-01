import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  improveExperienceSchema,
  generateSummarySchema,
  scoreATSSchema,
  suggestSkillsSchema,
} from "../validators/ai.validator.js";
import {
  improveExperienceController,
  generateSummaryController,
  scoreATSController,
  suggestSkillsController,
} from "../controllers/ai.controller.js";

const router = express.Router();

// All AI endpoints require authentication
router.post(
  "/improve-experience",
  authMiddleware,
  validate(improveExperienceSchema),
  improveExperienceController
);

router.post(
  "/generate-summary",
  authMiddleware,
  validate(generateSummarySchema),
  generateSummaryController
);

router.post(
  "/score-ats",
  authMiddleware,
  validate(scoreATSSchema),
  scoreATSController
);

router.post(
  "/suggest-skills",
  authMiddleware,
  validate(suggestSkillsSchema),
  suggestSkillsController
);

export default router;
