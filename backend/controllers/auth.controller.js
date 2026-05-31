import * as authService from "../services/auth.service.js";
import * as userRepository from "../repositories/user.repository.js";
import { successResponse } from "../utils/response.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body.email,
      req.body.password
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);
    successResponse(res, { accessToken, user }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(token);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    successResponse(res, { accessToken }, "Token refreshed");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await userRepository.updateRefreshToken(req.user.userId, null);
    res.clearCookie("refreshToken");
    successResponse(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};
