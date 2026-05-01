import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required"),
  summary: z.string().trim().optional().default(""),
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
