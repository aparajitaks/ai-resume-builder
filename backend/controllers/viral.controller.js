import * as viralService from "../services/viral.service.js";
import * as resumeService from "../services/resume.service.js";
import { successResponse } from "../utils/response.js";

export const roastResumeController = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user.userId);
    const roast = await viralService.roastResume(resume);
    
    successResponse(res, { roast }, "Resume roasted successfully! Now share it if you dare.");
  } catch (error) {
    next(error);
  }
};
