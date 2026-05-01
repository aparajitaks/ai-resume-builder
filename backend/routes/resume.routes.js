import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createResumeSchema } from "../validators/resume.validator.js";
import {
  createResume,
  getResumes,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createResumeSchema), createResume);
router.get("/", authMiddleware, getResumes);

export default router;
