import api from "./api";

const login = async (data) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const register = async (data) => {
  const res = await api.post("/auth/register", data);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
};
