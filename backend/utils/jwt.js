import jwt from "jsonwebtoken";

/**
 * Generate a short-lived access token (15 minutes).
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate a long-lived refresh token (7 days).
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Verify a token against a given secret.
 * Returns the decoded payload or throws.
 */
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
