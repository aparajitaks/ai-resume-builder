import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import { nanoid } from "nanoid";

// ── Toggle Share ──
export const toggleShare = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!resume) throw new AppError("Resume not found", 404);

    const isPublic = !resume.isPublic;
    const shareId = isPublic ? nanoid(10) : null;

    await prisma.resume.update({
      where: { id: req.params.id },
      data: { isPublic, shareId },
    });

    res.json({ success: true, data: { isPublic, shareId } });
  } catch (error) {
    next(error);
  }
};

// ── Get Public Resume ──
export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { shareId: req.params.shareId, isPublic: true },
      select: {
        id: true, title: true, personal: true, summary: true,
        experience: true, education: true, skills: true,
        atsScore: true, createdAt: true, updatedAt: true,
      },
    });
    if (!resume) throw new AppError("Resume not found or not public", 404);

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};
