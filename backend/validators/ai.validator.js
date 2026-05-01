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

export const scoreATSSchema = z.object({
  personal: z
    .object({
      fullName: z.string().optional().default(""),
      title: z.string().optional().default(""),
    })
    .optional()
    .default({}),
  summary: z.string().optional().default(""),
  experience: z
    .array(
      z.object({
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        description: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().optional().default(""),
        school: z.string().optional().default(""),
        year: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  skills: z.array(z.string()).optional().default([]),
});

export const suggestSkillsSchema = z.object({
  title: z.string().trim().min(1, "Professional title is required"),
  experience: z
    .array(
      z.object({
        role: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  currentSkills: z.array(z.string()).optional().default([]),
});
