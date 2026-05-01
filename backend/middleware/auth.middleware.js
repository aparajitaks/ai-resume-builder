import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

/**
 * Authentication middleware — verifies the Bearer access token
 * and attaches the decoded user to `req.user`.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, iat, exp }
    next();
  } catch (error) {
    // Let the global error handler distinguish expired vs invalid
    next(error);
  }
};

export default authMiddleware;