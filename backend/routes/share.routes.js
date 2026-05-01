import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { toggleShare, getPublicResume } from "../controllers/share.controller.js";

const router = express.Router();

// Toggle sharing for a resume (auth required)
router.post("/resumes/:id/share", authMiddleware, toggleShare);

// Get a public resume by shareId (NO auth required)
router.get("/share/:shareId", getPublicResume);

export default router;
