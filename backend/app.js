import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import coverLetterRoutes from "./routes/coverLetter.routes.js";
import shareRoutes from "./routes/share.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";

const app = express();

// ── CORS ──
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// ── Body parsing with size limit ──
app.use(express.json({ limit: "1mb" }));

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api", shareRoutes);

// ── 404 catch-all ──
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ── Global error handler (must be last) ──
app.use(errorHandler);

export default app;
