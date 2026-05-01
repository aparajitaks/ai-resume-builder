import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./validators/env.validator.js";

// Validate env BEFORE importing anything that uses env vars
validateEnv();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
