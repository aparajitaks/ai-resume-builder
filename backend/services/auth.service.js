import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import config from "../config/index.js";

export const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  return userRepository.createUser({ name, email, password: hashedPassword });
};

export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Securely store refresh token for rotation/revocation
  await userRepository.updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const refresh = async (token) => {
  const decoded = verifyToken(token, config.jwtRefreshSecret);
  const user = await userRepository.findUserById(decoded.userId);

  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  await userRepository.updateRefreshToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
};
