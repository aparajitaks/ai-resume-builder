import {
  improveExperience,
  generateSummary,
} from "../services/ai.service.js";

export const improveExperienceController = async (req, res) => {
  try {
    const improvedText = await improveExperience(req.body);
    res.json({ improvedText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- Generate Summary Controller --------
export const generateSummaryController = async (req, res) => {
  try {
    const summary = await generateSummary(req.body);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
