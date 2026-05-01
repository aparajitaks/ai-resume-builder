import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().optional().default(""),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});
