import { generateCoverLetter } from "../services/coverLetter.service.js";
import { successResponse } from "../utils/response.js";

export const generateCoverLetterController = async (req, res, next) => {
  try {
    const coverLetter = await generateCoverLetter(req.body);
    successResponse(res, { coverLetter }, "Cover letter generated successfully");
  } catch (error) {
    next(error);
  }
};
