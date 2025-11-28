import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, createCategory } from "../api/categoryApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // cek admin langsung dari localStorage
  const isAdmin =
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

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

  const handleClick = (id) => {
    navigate(`/categories/${id}`);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newName || !newSlug) return;
    try {
      await createCategory({ name: newName, slug: newSlug });
      setNewName("");
      setNewSlug("");
      loadCategories();
    } catch (err) {
      console.error("Gagal buat kategori", err);
      alert("Gagal membuat kategori");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__accent" />
        <div>
          <h1 className="page-title">Kategori</h1>
          <p className="page-subtitle">
            Jelajahi berita berdasarkan kategori teknologi.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="page-subtitle">Memuat kategori...</p>
      ) : (
        <div className="chip-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="chip"
              type="button"
              onClick={() => handleClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* PANEL ADMIN DI HALAMAN KATEGORI */}
      {isAdmin && (
        <div className="admin-form-card" style={{ marginTop: 18 }}>
          <p className="admin-badge">Admin · Kategori</p>
          <h2 className="profile-card__title">Tambah Kategori</h2>
          <form
            className="admin-form admin-form-row"
            onSubmit={handleCreateCategory}
          >
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="catName">
                Nama kategori
              </label>
              <input
                id="catName"
                className="admin-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: AI"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="catSlug">
                Slug
              </label>
              <input
                id="catSlug"
                className="admin-input"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="Contoh: ai"
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-button">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
