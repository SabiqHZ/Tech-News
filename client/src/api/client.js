import axios from "axios";

// baseURL disesuaikan dengan backend kamu
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
