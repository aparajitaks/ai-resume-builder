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

// ── Duplicate Resume ──
export const duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!original) {
      throw new AppError("Resume not found", 404);
    }

    const duplicate = await Resume.create({
      userId: req.user.userId,
      title: `${original.title} (Copy)`,
      personal: original.personal,
      summary: original.summary,
      experience: original.experience,
      education: original.education,
      skills: original.skills,
      // Reset ATS score and sharing for the copy
      atsScore: { score: null, feedback: "", checkedAt: null },
      shareId: null,
      isPublic: false,
    });

    res.status(201).json({
      success: true,
      data: duplicate,
    });
  } catch (error) {
    next(error);
  }
};

// ── Resume Stats (Dashboard Analytics) ──
export const getResumeStats = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select("title personal.fullName personal.title atsScore updatedAt")
      .lean();

    const totalResumes = resumes.length;
    const scored = resumes.filter((r) => r.atsScore?.score != null);
    const avgAtsScore =
      scored.length > 0
        ? Math.round(scored.reduce((sum, r) => sum + r.atsScore.score, 0) / scored.length)
        : null;
    const bestAtsScore =
      scored.length > 0
        ? Math.max(...scored.map((r) => r.atsScore.score))
        : null;
    const recentResumes = resumes.slice(0, 5);

    res.json({
      success: true,
      data: {
        totalResumes,
        avgAtsScore,
        bestAtsScore,
        recentResumes,
      },
    });
  } catch (error) {
    next(error);
  }
};
