import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  fetchCategories,
} from "../../api/categoryApi";

export default function AdminCategoryFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const init = async () => {
      if (isEdit && categoryId) {
        try {
          // ambil semua, lalu cari satu (supaya backend tidak perlu /categories/:id khusus dulu)
          const all = await fetchCategories();
          const cat = all.find((c) => String(c.id) === String(categoryId));
          if (cat) {
            setName(cat.name);
            setSlug(cat.slug);
          }
        } catch (err) {
          console.error("Gagal load kategori untuk edit", err);
        }
      }
    };
    init();
  }, [isEdit, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, slug };

    try {
      if (isEdit && categoryId) {
        await updateCategory(categoryId, payload);
      } else {
        await createCategory(payload);
      }
      navigate("/admin/categories");
    } catch (err) {
      console.error("Gagal simpan kategori", err);
      alert("Gagal menyimpan kategori");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="page-header__accent" />
          <div>
            <p className="admin-badge">
              {isEdit ? "Edit Kategori" : "Kategori Baru"}
            </p>
            <h1 className="admin-title">
              {isEdit ? "Perbarui Kategori" : "Tambah Kategori"}
            </h1>
            <p className="admin-subtitle">
              Nama dan slug akan dipakai untuk mengelompokkan artikel.
            </p>
          </div>
        </div>
      </header>

      <div className="admin-form-card">
        <form className="admin-form admin-form-row" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="name">
              Nama Kategori
            </label>
            <input
              id="name"
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: AI"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className="admin-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Contoh: ai"
              required
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => navigate("/admin/categories")}
            >
              Batal
            </button>
            <button type="submit" className="admin-button">
              {isEdit ? "Simpan Perubahan" : "Simpan Kategori"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
