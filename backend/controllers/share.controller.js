import Resume from "../models/Resume.model.js";
import AppError from "../utils/AppError.js";
import { nanoid } from "nanoid";

// ── Toggle Share (generate or clear shareId) ──
export const toggleShare = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.isPublic) {
      // Turn off sharing
      resume.shareId = null;
      resume.isPublic = false;
    } else {
      // Turn on sharing
      resume.shareId = nanoid(10);
      resume.isPublic = true;
    }

    await resume.save();

    res.json({
      success: true,
      data: {
        isPublic: resume.isPublic,
        shareId: resume.shareId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Public Resume (no auth required) ──
export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    }).select("-userId -__v");

    if (!resume) {
      throw new AppError("Resume not found or not public", 404);
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};
