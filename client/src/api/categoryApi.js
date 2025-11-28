import apiClient from "./client";

// GET /api/categories
export const fetchCategories = async () => {
  const res = await apiClient.get("/categories");
  return res.data.data;
};

// GET /api/categories/:id/articles
// dipakai di CategoryArticlesPage (user side)
export const fetchArticlesByCategory = async (categoryId) => {
  const res = await apiClient.get(`/categories/${categoryId}/articles`);
  // backend kirim: { success, category, data: [ ...artikel ] }
  // di sini kita kembalikan hanya array artikelnya:
  return res.data.data;
};

// POST /api/categories (admin)
export const createCategory = async (payload) => {
  const res = await apiClient.post("/categories", payload);
  return res.data.data;
};

// PUT /api/categories/:id (admin)
export const updateCategory = async (id, payload) => {
  const res = await apiClient.put(`/categories/${id}`, payload);
  return res.data.data;
};

// DELETE /api/categories/:id (admin)
export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`/categories/${id}`);
  return res.data;
};
