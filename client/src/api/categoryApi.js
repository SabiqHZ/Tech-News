import apiClient from "./client";

// GET semua kategori
export const fetchCategories = async () => {
  const res = await apiClient.get("/categories");
  return res.data.data;
};

// GET artikel per kategori (user side)
export const fetchArticlesByCategory = async (categoryId) => {
  const res = await apiClient.get(`/categories/${categoryId}/articles`);
  return res.data.data;
};

// CREATE
export const createCategory = async (payload) => {
  const res = await apiClient.post("/categories", payload);
  return res.data.data;
};

// UPDATE
export const updateCategory = async (id, payload) => {
  const res = await apiClient.put(`/categories/${id}`, payload);
  return res.data.data;
};

// DELETE
export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`/categories/${id}`);
  return res.data;
};
