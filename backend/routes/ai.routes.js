import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  improveExperienceSchema,
  generateSummarySchema,
} from "../validators/ai.validator.js";
import {
  improveExperienceController,
  generateSummaryController,
} from "../controllers/ai.controller.js";

const router = express.Router();

// AI endpoints require authentication
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

export default router;
