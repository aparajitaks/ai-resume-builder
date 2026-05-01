import {
  improveExperience,
  generateSummary,
  scoreATS,
  suggestSkills,
  tailorToJob,
} from "../services/ai.service.js";

// ── Improve Experience ──
export const improveExperienceController = async (req, res, next) => {
  try {
    const improvedText = await improveExperience(req.body);

    res.json({
      success: true,
      data: { improvedText },
    });
  } catch (error) {
    next(error);
  }
};

// ── Generate Summary ──
export const generateSummaryController = async (req, res, next) => {
  try {
    const summary = await generateSummary(req.body);

    res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

// ── ATS Score ──
export const scoreATSController = async (req, res, next) => {
  try {
    const result = await scoreATS(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ── Suggest Skills ──
export const suggestSkillsController = async (req, res, next) => {
  try {
    const skills = await suggestSkills(req.body);

    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    next(error);
  }
};

// ── Tailor to Job ──
export const tailorToJobController = async (req, res, next) => {
  try {
    const result = await tailorToJob(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
