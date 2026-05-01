import * as resumeService from "../services/resume.service.js";
import { successResponse } from "../utils/response.js";

export const createResume = async (req, res, next) => {
  try {
    const resume = await resumeService.createResume(req.user.userId, req.body);
    successResponse(res, resume, "Resume created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const data = await resumeService.getUserResumes(req.user.userId, req.query);
    successResponse(res, data, "Resumes retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user.userId);
    successResponse(res, resume, "Resume retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user.userId, req.body);
    successResponse(res, resume, "Resume updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.userId);
    successResponse(res, null, "Resume deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const duplicateResume = async (req, res, next) => {
  try {
    const duplicate = await resumeService.duplicateResume(req.params.id, req.user.userId);
    successResponse(res, duplicate, "Resume duplicated successfully", 201);
  } catch (error) {
    next(error);
  }
};
