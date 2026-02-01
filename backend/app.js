import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);

app.use(errorHandler);

export default app;
