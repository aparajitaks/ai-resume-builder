import * as resumeRepository from "../repositories/resume.repository.js";
import AppError from "../utils/AppError.js";

export const createResume = async (userId, resumeData) => {
  return resumeRepository.create({ userId, ...resumeData });
};

export const getUserResumes = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [resumes, total] = await Promise.all([
    resumeRepository.findAllByUserId(userId, { skip, take: limit }),
    resumeRepository.countAllByUserId(userId),
  ]);

  return {
    resumes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getResumeById = async (id, userId) => {
  const resume = await resumeRepository.findById(id);
  if (!resume || resume.userId !== userId) {
    throw new AppError("Resume not found", 404);
  }
  return resume;
};

export const updateResume = async (id, userId, data) => {
  const resume = await getResumeById(id, userId);
  return resumeRepository.update(resume.id, data);
};

export const deleteResume = async (id, userId) => {
  const resume = await getResumeById(id, userId);
  return resumeRepository.softDelete(resume.id);
};

export const duplicateResume = async (id, userId) => {
  const original = await getResumeById(id, userId);
  // eslint-disable-next-line no-unused-vars
  const { id: _, createdAt: __, updatedAt: ___, shareId: ____, ...data } = original;
  
  return resumeRepository.create({
    ...data,
    userId,
    title: `${data.title} (Copy)`,
    atsScore: { score: null, feedback: "", checkedAt: null },
  });
};

export const getResumeStats = async (userId) => {
  const resumes = await resumeRepository.getStats(userId);

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

  return { totalResumes, avgAtsScore, bestAtsScore, recentResumes };
};
