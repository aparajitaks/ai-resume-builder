import {
  improveExperience,
  generateSummary,
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
