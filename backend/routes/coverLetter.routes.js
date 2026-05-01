import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { generateCoverLetterSchema } from "../validators/coverLetter.validator.js";
import { generateCoverLetterController } from "../controllers/coverLetter.controller.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  validate(generateCoverLetterSchema),
  generateCoverLetterController
);

export default router;
