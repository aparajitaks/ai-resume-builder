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
