import api from "../api/axios.js";

export const generateCoverLetter = async ({
  resumeSummary,
  resumeExperience,
  resumeSkills,
  jobTitle,
  company,
  jobDescription,
}) => {
  const res = await api.post("/api/cover-letter/generate", {
    resumeSummary,
    resumeExperience,
    resumeSkills,
    jobTitle,
    company,
    jobDescription,
  });
  return res.data;
};
