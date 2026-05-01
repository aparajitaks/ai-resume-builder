import api from "../api/axios.js";

export const createResume = async (resumeData) => {
  const res = await api.post("/api/resumes", resumeData);
  return res.data;
};

export const getResumes = async () => {
  const res = await api.get("/api/resumes");
  return res.data;
};

export const getResumeById = async (id) => {
  const res = await api.get(`/api/resumes/${id}`);
  return res.data;
};

export const updateResume = async (id, resumeData) => {
  const res = await api.put(`/api/resumes/${id}`, resumeData);
  return res.data;
};

export const deleteResume = async (id) => {
  const res = await api.delete(`/api/resumes/${id}`);
  return res.data;
};
