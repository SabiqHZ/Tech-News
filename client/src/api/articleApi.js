import apiClient from "./client";

// GET /api/articles
export const fetchArticles = async () => {
  const res = await apiClient.get("/articles");
  return res.data.data; // karena di backend kita kirim { success, data }
};

// GET /api/articles/:id
export const fetchArticleById = async (id) => {
  const res = await apiClient.get(`/articles/${id}`);
  return res.data.data;
};
