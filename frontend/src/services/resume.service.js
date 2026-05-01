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

export const duplicateResume = async (id) => {
  const res = await api.post(`/api/resumes/${id}/duplicate`);
  return res.data;
};

export const getResumeStats = async () => {
  const res = await api.get("/api/resumes/stats");
  return res.data;
};

export const toggleShare = async (id) => {
  const res = await api.post(`/api/resumes/${id}/share`);
  return res.data;
};

export const getPublicResume = async (shareId) => {
  const res = await api.get(`/api/share/${shareId}`);
  return res.data;
};
