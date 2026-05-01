import { z } from "zod";

export const improveExperienceSchema = z.object({
  role: z.string().trim().optional().default(""),
  company: z.string().trim().optional().default(""),
  description: z
    .string()
    .trim()
    .min(1, "Description is required to improve"),
});

export const generateSummarySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  title: z.string().trim().min(1, "Professional title is required"),
  skills: z.array(z.string()).optional().default([]),
  experience: z
    .array(
      z.object({
        role: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});
