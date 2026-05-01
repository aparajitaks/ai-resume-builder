import api from "../api/axios.js";

export const loginUser = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await api.post("/api/auth/refresh", { refreshToken });
  return res.data;
};
