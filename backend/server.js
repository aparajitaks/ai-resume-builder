import config from "./config/index.js";
import logger from "./utils/logger.js";
import app from "./app.js";
import prisma from "./config/prisma.js";

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info("✅ Database connected (Prisma)");

    app.listen(config.port, () => {
      logger.info(`✅ Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server: " + error.message);
    process.exit(1);
  }
};

// Graceful shutdown handlers
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
