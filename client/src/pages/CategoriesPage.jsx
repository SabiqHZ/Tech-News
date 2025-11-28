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
        <>
          {/* chip untuk user */}
          <div className="chip-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="chip"
                type="button"
                onClick={() => handleChipClick(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* tabel + form admin */}
          {isAdmin && (
            <div className="admin-form-card" style={{ marginTop: 18 }}>
              <p className="admin-badge">
                Admin · {editingId ? "Edit Kategori" : "Kategori Baru"}
              </p>
              <h2 className="profile-card__title">
                {editingId ? "Perbarui Kategori" : "Tambah Kategori"}
              </h2>

              {/* daftar kategori dengan tombol edit/hapus */}
              <div className="admin-table-wrapper" style={{ marginTop: 10 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Slug</th>
                      <th style={{ width: "120px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="admin-button admin-button--ghost"
                              onClick={() => handleEditClick(cat)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-button admin-button--ghost"
                              onClick={() => handleDeleteClick(cat.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={3}>Belum ada kategori.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* form create/edit */}
              <form
                className="admin-form admin-form-row"
                onSubmit={handleSubmit}
                style={{ marginTop: 10 }}
              >
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="catName">
                    Nama kategori
                  </label>
                  <input
                    id="catName"
                    className="admin-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Contoh: ai"
                  />
                </div>

                <div className="admin-form-actions">
                  {editingId && (
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      onClick={resetForm}
                    >
                      Batal edit
                    </button>
                  )}
                  <button type="submit" className="admin-button">
                    {editingId ? "Simpan Perubahan" : "Simpan"}
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
