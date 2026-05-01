import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createResumeSchema,
  updateResumeSchema,
} from "../validators/resume.validator.js";
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createResumeSchema), createResume);
router.get("/", authMiddleware, getResumes);
router.get("/:id", authMiddleware, getResumeById);
router.put("/:id", authMiddleware, validate(updateResumeSchema), updateResume);
router.delete("/:id", authMiddleware, deleteResume);

export default router;
