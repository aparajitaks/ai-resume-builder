import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

/**
 * Centralized error handler — maps known error types to proper
 * HTTP status codes and returns a standardized response shape.
 */
const errorHandler = (err, req, res, _next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let error = err.name || "ServerError";

  // ── Zod Validation Error ──
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    error = err.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
  }

  // ── JWT Errors ──
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    error = "AuthError";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
    error = "TokenExpired";
  }

  // ── Mongoose Validation Error ──
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation failed";
    error = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // ── Mongoose Duplicate Key ──
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    error = "DuplicateKey";
  }

  // ── Custom AppError (operational) ──
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = "AppError";
  }

  // Log in development only
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${statusCode}] ${message}`, err.stack || "");
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default errorHandler;
