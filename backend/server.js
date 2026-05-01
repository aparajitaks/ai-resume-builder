import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./validators/env.validator.js";

// Validate env BEFORE importing anything that uses env vars
validateEnv();

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log("✅ Database connected (Prisma)");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
