import { generateSummary, improveExperience } from "../ai/ai.service.js";

const generateSummaryController = async (req, res) => {
  try {
    const summary = await generateSummary(req.body);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const improveExperienceController = async (req, res) => {
  try {
    const improved = await improveExperience(req.body);
    res.json({ improved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  generateSummaryController,
  improveExperienceController,
};
