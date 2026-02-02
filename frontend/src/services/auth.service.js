import axios from "./api";

export const loginUser = async (credentials) => {
  const res = await axios.post("/login", credentials);
  return res.data;
};
