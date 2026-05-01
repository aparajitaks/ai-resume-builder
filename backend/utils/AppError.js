/**
 * Custom application error class for predictable error handling.
 * Use this throughout controllers/services to throw operational errors
 * that the global error handler can format consistently.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
