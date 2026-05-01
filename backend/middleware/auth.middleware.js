import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import config from "../config/index.js";

/**
 * Authentication middleware — verifies the Bearer access token
 * or HTTP-only cookie and attaches the decoded user to `req.user`.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = verifyToken(token, config.jwtSecret);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;