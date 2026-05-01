import { z } from "zod";

export const generateCoverLetterSchema = z.object({
  resumeSummary: z.string().optional().default(""),
  resumeExperience: z
    .array(
      z.object({
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  resumeSkills: z.array(z.string()).optional().default([]),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  company: z.string().trim().min(1, "Company name is required"),
  jobDescription: z.string().trim().min(10, "Job description is required (min 10 chars)"),
});
