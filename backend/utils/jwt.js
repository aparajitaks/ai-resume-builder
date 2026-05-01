import jwt from "jsonwebtoken";
import config from "../config/index.js";

/**
 * Generate a short-lived access token (15 minutes).
 */
export const generateAccessToken = (userId, role = "USER") => {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: "15m",
  });
};

/**
 * Generate a long-lived refresh token (7 days).
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: "7d",
  });
};

/**
 * Verify a token against a given secret.
 */
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
