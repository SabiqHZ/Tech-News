import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, deleteCategory } from "../../api/categoryApi";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Gagal load kategori", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Gagal hapus kategori", err);
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="page-header__accent" />
          <div>
            <p className="admin-badge">Struktur</p>
            <h1 className="admin-title">Kategori</h1>
            <p className="admin-subtitle">
              Atur kategori berita untuk tech news kamu.
            </p>
          </div>
        </div>

        <Link to="/admin/categories/new" className="admin-button">
          + Kategori baru
        </Link>
      </header>

      {loading ? (
        <p className="admin-subtitle">Memuat kategori...</p>
      ) : (
        <div className="admin-table-wrapper">
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
                      <Link
                        to={`/admin/categories/${cat.id}/edit`}
                        className="admin-button admin-button--ghost"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => handleDelete(cat.id)}
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
      )}
    </div>
  );
}
