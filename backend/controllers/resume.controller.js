import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

// ── Create Resume ──
export const createResume = async (req, res, next) => {
  try {
    const resume = await prisma.resume.create({
      data: {
        userId: req.user.userId,
        ...req.body,
      },
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// ── Get All Resumes ──
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

// ── Get Resume By ID ──
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!resume) throw new AppError("Resume not found", 404);

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// ── Update Resume ──
export const updateResume = async (req, res, next) => {
  try {
    // Verify ownership first
    const existing = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!existing) throw new AppError("Resume not found", 404);

    const resume = await prisma.resume.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// ── Delete Resume ──
export const deleteResume = async (req, res, next) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!existing) throw new AppError("Resume not found", 404);

    await prisma.resume.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ── Duplicate Resume ──
export const duplicateResume = async (req, res, next) => {
  try {
    const original = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!original) throw new AppError("Resume not found", 404);

    const duplicate = await prisma.resume.create({
      data: {
        userId: req.user.userId,
        title: `${original.title} (Copy)`,
        personal: original.personal,
        summary: original.summary,
        experience: original.experience,
        education: original.education,
        skills: original.skills,
        atsScore: { score: null, feedback: "", checkedAt: null },
        shareId: null,
        isPublic: false,
      },
    });

    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    next(error);
  }
};

// ── Resume Stats ──
export const getResumeStats = async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        personal: true,
        atsScore: true,
        updatedAt: true,
      },
    });

    const totalResumes = resumes.length;
    const scored = resumes.filter((r) => r.atsScore?.score != null);
    const avgAtsScore =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + r.atsScore.score, 0) / scored.length)
        : null;
    const bestAtsScore =
      scored.length > 0
        ? Math.max(...scored.map((r) => r.atsScore.score))
        : null;
    const recentResumes = resumes.slice(0, 5);

    res.json({
      success: true,
      data: { totalResumes, avgAtsScore, bestAtsScore, recentResumes },
    });
  } catch (error) {
    next(error);
  }
};
