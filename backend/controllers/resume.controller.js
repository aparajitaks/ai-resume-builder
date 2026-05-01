import Resume from "../models/Resume.model.js";
import AppError from "../utils/AppError.js";

// ── Create Resume ──
export const createResume = async (req, res, next) => {
  try {
    const resume = await Resume.create({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get All Resumes ──
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Resume By ID ──
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Resume ──
export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Resume ──
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
