import { z } from "zod";

const personalSchema = z
  .object({
    fullName: z.string().trim().optional().default(""),
    title: z.string().trim().optional().default(""),
    email: z.string().trim().optional().default(""),
    phone: z.string().trim().optional().default(""),
    location: z.string().trim().optional().default(""),
  })
  .optional()
  .default({});

const experienceItemSchema = z.object({
  role: z.string().optional().default(""),
  company: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const educationItemSchema = z.object({
  degree: z.string().optional().default(""),
  school: z.string().optional().default(""),
  year: z.string().optional().default(""),
});

export const createResumeSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required"),
  personal: personalSchema,
  summary: z.string().trim().optional().default(""),
  experience: z.array(experienceItemSchema).optional().default([]),
  education: z.array(educationItemSchema).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
});

export const updateResumeSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required").optional(),
  personal: personalSchema.optional(),
  summary: z.string().trim().optional(),
  experience: z.array(experienceItemSchema).optional(),
  education: z.array(educationItemSchema).optional(),
  skills: z.array(z.string()).optional(),
  atsScore: z
    .object({
      score: z.number().nullable().optional(),
      feedback: z.string().optional().default(""),
      checkedAt: z.string().nullable().optional(),
    })
    .optional(),
});

export const resumeIdParamSchema = z.object({
  id: z.string().min(1, "Resume ID is required"),
});
