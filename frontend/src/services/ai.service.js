import api from "../api/axios.js";

export const improveExperience = async ({ role, company, description }) => {
  const res = await api.post("/api/ai/improve-experience", {
    role,
    company,
    description,
  });
  return res.data;
};

export const generateSummary = async ({
  fullName,
  title,
  skills,
  experience,
}) => {
  const res = await api.post("/api/ai/generate-summary", {
    fullName,
    title,
    skills,
    experience,
  });
  return res.data;
};

export const scoreATS = async ({
  personal,
  summary,
  experience,
  education,
  skills,
}) => {
  const res = await api.post("/api/ai/score-ats", {
    personal,
    summary,
    experience,
    education,
    skills,
  });
  return res.data;
};

export const suggestSkills = async ({ title, experience, currentSkills }) => {
  const res = await api.post("/api/ai/suggest-skills", {
    title,
    experience,
    currentSkills,
  });
  return res.data;
};
