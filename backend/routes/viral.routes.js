import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { consumeCredits } from "../middleware/usage.middleware.js";
import { roastResumeController } from "../controllers/viral.controller.js";

const router = express.Router();

router.use(authMiddleware);

// Viral features cost 1 credit
router.post("/roast/:id", consumeCredits(1), roastResumeController);

export default router;
