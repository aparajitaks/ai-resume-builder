import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  handleStripeWebhook,
  getSubscriptionStatus,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Webhook is called by Stripe
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

router.use(authMiddleware);

router.get("/status", getSubscriptionStatus);
router.post("/create-checkout", createCheckoutSession);

export default router;
