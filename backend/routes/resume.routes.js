import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createResume,
  getResumes,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createResume);
router.get("/", authMiddleware, getResumes);

export default router;
