import Resume from "../models/Resume.model.js";

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
    const resumes = await Resume.find({ userId: req.user.userId });

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};
