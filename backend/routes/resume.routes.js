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
  duplicateResume,
  getResumeStats,
} from "../controllers/resume.controller.js";

const router = express.Router();

// Stats must come BEFORE /:id to avoid matching "stats" as an id
router.get("/stats", authMiddleware, getResumeStats);

router.post("/", authMiddleware, validate(createResumeSchema), createResume);
router.get("/", authMiddleware, getResumes);
router.get("/:id", authMiddleware, getResumeById);
router.put("/:id", authMiddleware, validate(updateResumeSchema), updateResume);
router.delete("/:id", authMiddleware, deleteResume);
router.post("/:id/duplicate", authMiddleware, duplicateResume);

export default router;
