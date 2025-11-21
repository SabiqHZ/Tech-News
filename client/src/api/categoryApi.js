import apiClient from "./client";

// GET /api/categories
export const fetchCategories = async () => {
  const res = await apiClient.get("/categories");
  return res.data.data;
};

// GET /api/categories/:id/articles
export const fetchArticlesByCategory = async (categoryId) => {
  const res = await apiClient.get(`/categories/${categoryId}/articles`);
  return res.data.data; // array artikel
};
