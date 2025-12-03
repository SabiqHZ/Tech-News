import apiClient from "./client";

// GET /articles dengan pagination
export const fetchArticles = async (page = 1, limit = 6) => {
  const res = await apiClient.get("/articles", {
    params: { page, limit },
  });

  // backend balikin { success, data, page, limit, total, totalPages }
  return res.data;
};

// GET /articles/:id
export const fetchArticleById = async (id) => {
  const res = await apiClient.get(`/articles/${id}`);
  return res.data.data;
};

// POST /articles
export const createArticle = async (payload) => {
  const res = await apiClient.post("/articles", payload);
  return res.data.data;
};

// PUT /articles/:id
export const updateArticle = async (id, payload) => {
  const res = await apiClient.put(`/articles/${id}`, payload);
  return res.data.data;
};

// DELETE /articles/:id
export const deleteArticle = async (id) => {
  const res = await apiClient.delete(`/articles/${id}`);
  return res.data;
};
