import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import { nanoid } from "nanoid";
import { successResponse } from "../utils/response.js";

// ── Toggle Share ──
export const toggleShare = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId, deletedAt: null },
    });
    if (!resume) throw new AppError("Resume not found", 404);

    const isPublic = !resume.isPublic;
    const shareId = isPublic ? nanoid(10) : null;

    await prisma.resume.update({
      where: { id: req.params.id },
      data: { isPublic, shareId },
    });

    successResponse(res, { isPublic, shareId }, "Share status updated");
  } catch (error) {
    next(error);
  }
};

// ── Get Public Resume ──
export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { shareId: req.params.shareId, isPublic: true, deletedAt: null },
      include: {
        user: {
          select: {
            name: true,
            referralCode: true,
          },
        },
      },
    });

    if (!resume) throw new AppError("Resume not found or not public", 404);

    // Dynamic Meta context for the frontend to inject into <head>
    const meta = {
      title: `${resume.user.name}'s Professional Portfolio | Powered by AI`,
      description: `Check out this AI-optimized resume. Create your own and get 15 free credits using code: ${resume.user.referralCode}`,
      referralUrl: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/register?ref=${resume.user.referralCode}`
    };

    successResponse(res, { resume, meta }, "Public resume retrieved");
  } catch (error) {
    next(error);
  }
};
