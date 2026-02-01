import express from "express";
import { createResume } from "../controllers/resume.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createResume);

export default router;
