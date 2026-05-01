import api from "../api/axios.js";

export const createResume = async (resumeData) => {
  const res = await api.post("/api/resumes", resumeData);
  return res.data;
};

export const getResumes = async () => {
  const res = await api.get("/api/resumes");
  return res.data;
};
