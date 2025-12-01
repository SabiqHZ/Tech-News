import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin =
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChipClick = (id) => {
    navigate(`/categories/${id}`);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      if (editingId) {
        await updateCategory(editingId, { name, slug });
      } else {
        await createCategory({ name, slug });
      }
      resetForm();
      loadCategories();
    } catch (err) {
      console.error("Gagal simpan kategori", err);
      alert("Gagal menyimpan kategori");
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Gagal hapus kategori", err);
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <div className="page">
      {/* Header Clean */}
      <div className="page-header">
        <h1 className="page-header__logo">Kategori</h1>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p style={{ color: "#64748b", margin: 0 }}>Memuat kategori...</p>
        </div>
      ) : (
        <>
          {/* Chip Categories */}
          <div className="categories-grid">
            <div className="categories-header">
              <h2 className="categories-title">Jelajahi Kategori</h2>
              <p className="categories-subtitle">
                Pilih kategori untuk melihat berita teknologi terkait
              </p>
            </div>

            <div className="categories-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="category-card"
                  type="button"
                  onClick={() => handleChipClick(cat.id)}
                >
                  <span className="category-card__icon">📂</span>
                  <span className="category-card__name">{cat.name}</span>
                  <span className="category-card__arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Admin Panel */}
          {isAdmin && (
            <div className="admin-form-card">
              <p className="admin-badge">
                Admin · {editingId ? "Edit Kategori" : "Kategori Baru"}
              </p>
              <h2
                className="profile-card__title"
                style={{ marginBottom: "20px" }}
              >
                {editingId ? "Perbarui Kategori" : "Kelola Kategori"}
              </h2>

              {/* Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Slug</th>
                      <th style={{ width: "140px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <strong>{cat.name}</strong>
                        </td>
                        <td>
                          <code
                            style={{
                              background: "#f1f5f9",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                            }}
                          >
                            {cat.slug}
                          </code>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="admin-button"
                              onClick={() => handleEditClick(cat)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="admin-button"
                              onClick={() => handleDeleteClick(cat.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{ textAlign: "center", color: "#94a3b8" }}
                        >
                          Belum ada kategori.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Form */}
              <form
                className="admin-form"
                onSubmit={handleSubmit}
                style={{ marginTop: "20px" }}
              >
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="catName">
                    Nama Kategori
                  </label>
                  <input
                    id="catName"
                    className="admin-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Artificial Intelligence"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="catSlug">
                    Slug (URL)
                  </label>
                  <input
                    id="catSlug"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Contoh: artificial-intelligence"
                  />
                </div>

                <div className="admin-form-actions">
                  {editingId && (
                    <button
                      type="button"
                      className="admin-button"
                      onClick={resetForm}
                    >
                      Batal
                    </button>
                  )}
                  <button type="submit" className="admin-button">
                    {editingId ? "💾 Simpan Perubahan" : "➕ Tambah Kategori"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
