import apiClient from "./client";

// GET /api/articles
export const fetchArticles = async () => {
  const res = await apiClient.get("/articles");
  return res.data.data;
};

// GET /api/articles/:id
export const fetchArticleById = async (id) => {
  const res = await apiClient.get(`/articles/${id}`);
  return res.data.data;
};

// POST /api/articles
export const createArticle = async (payload) => {
  const res = await apiClient.post("/articles", payload);
  return res.data.data;
};

// PUT /api/articles/:id
export const updateArticle = async (id, payload) => {
  const res = await apiClient.put(`/articles/${id}`, payload);
  return res.data.data;
};

// DELETE /api/articles/:id
export const deleteArticle = async (id) => {
  const res = await apiClient.delete(`/articles/${id}`);
  return res.data;
};
