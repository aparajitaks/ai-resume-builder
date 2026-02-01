import express from "express";
import { createResume } from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createResume);

export default router;
