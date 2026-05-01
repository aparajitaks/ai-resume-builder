import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import config from "./config/index.js";
import logger from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import coverLetterRoutes from "./routes/coverLetter.routes.js";
import shareRoutes from "./routes/share.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import viralRoutes from "./routes/viral.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";

const app = express();

// ── Security Hardening ──
app.use(helmet());
app.use(cookieParser());

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ── Logging ──
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

// ── CORS ──
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// ── Webhook Route (MUST be before express.json() for Stripe raw body) ──
app.use("/api/payments", paymentRoutes);

// ── Body parsing ──
app.use(express.json({ limit: "1mb" }));

// ── Root Welcome Route ──
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Resume Builder API is Running",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is running in " + config.nodeEnv + " mode" });
});

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/viral", viralRoutes);
app.use("/api", shareRoutes);

// ── 404 catch-all ──
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ── Global error handler ──
app.use(errorHandler);

export default app;
