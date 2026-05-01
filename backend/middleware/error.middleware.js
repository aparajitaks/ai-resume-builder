import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

/**
 * Centralized error handler
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errorCode = err.name || "ServerError";

  // ── Zod Validation Error ──
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorCode = "ValidationError";
    const details = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    message = `${message}: ${details}`;
  }

  // ── Prisma: Unique constraint violation (P2002) ──
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    statusCode = 409;
    const field = err.meta?.target?.[0] || "field";
    message = `${field} already exists`;
    errorCode = "DuplicateKey";
  }

  // ── Prisma: Record not found (P2025) ──
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
    errorCode = "NotFound";
  }

  // Log error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};

export default errorHandler;
