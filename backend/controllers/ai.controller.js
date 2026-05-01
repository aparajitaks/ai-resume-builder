import {
  improveExperience,
  generateSummary,
  scoreATS,
  suggestSkills,
  tailorToJob,
} from "../services/ai.service.js";
import { successResponse } from "../utils/response.js";

// ── Improve Experience ──
export const improveExperienceController = async (req, res, next) => {
  try {
    const improvedText = await improveExperience(req.body);
    successResponse(res, { improvedText }, "Experience improved successfully");
  } catch (error) {
    next(error);
  }
};

// ── Generate Summary ──
export const generateSummaryController = async (req, res, next) => {
  try {
    const summary = await generateSummary(req.body);
    successResponse(res, { summary }, "Summary generated successfully");
  } catch (error) {
    next(error);
  }
};

// ── ATS Score ──
export const scoreATSController = async (req, res, next) => {
  try {
    const result = await scoreATS(req.body);
    successResponse(res, result, "ATS score calculated successfully");
  } catch (error) {
    next(error);
  }
};

// ── Suggest Skills ──
export const suggestSkillsController = async (req, res, next) => {
  try {
    const skills = await suggestSkills(req.body);
    successResponse(res, { skills }, "Skills suggested successfully");
  } catch (error) {
    next(error);
  }
};

// ── Tailor to Job ──
export const tailorToJobController = async (req, res, next) => {
  try {
    const result = await tailorToJob(req.body);
    successResponse(res, result, "Resume tailored successfully");
  } catch (error) {
    next(error);
  }
};
