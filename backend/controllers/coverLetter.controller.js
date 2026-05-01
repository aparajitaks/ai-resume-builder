import { generateCoverLetter } from "../services/coverLetter.service.js";

export const generateCoverLetterController = async (req, res, next) => {
  try {
    const coverLetter = await generateCoverLetter(req.body);

    res.json({
      success: true,
      data: { coverLetter },
    });
  } catch (error) {
    next(error);
  }
};
