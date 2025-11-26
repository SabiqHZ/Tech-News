// client/src/api/authApi.js
import apiClient from "./client";

export const loginRequest = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data; // { token, user }
};
