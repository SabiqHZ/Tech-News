import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from "../../api/articleApi";
import { fetchCategories } from "../../api/categoryApi";

export default function AdminArticleFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        if (isEdit && articleId) {
          const article = await fetchArticleById(articleId);
          setTitle(article.title || "");
          setCategoryId(article.category_id ? String(article.category_id) : "");
          setThumbnailUrl(article.thumbnail_url || "");
          setContent(article.content || "");
          setStatus(article.published_at ? "published" : "draft");
        }
      } catch (err) {
        console.error("Gagal load form artikel", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isEdit, articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      category_id: categoryId ? Number(categoryId) : null,
      thumbnail_url: thumbnailUrl || null,
      content,
      author: "Admin", // kalau nanti punya auth beneran, ambil dari user login
      status, // backend bisa pakai ini untuk set published_at
    };

    try {
      if (isEdit && articleId) {
        await updateArticle(articleId, payload);
      } else {
        await createArticle(payload);
      }
      navigate("/admin/articles");
    } catch (err) {
      console.error("Gagal simpan artikel", err);
      alert("Gagal menyimpan artikel");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-subtitle">Memuat form...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="page-header__accent" />
          <div>
            <p className="admin-badge">
              {isEdit ? "Edit Artikel" : "Artikel Baru"}
            </p>
            <h1 className="admin-title">
              {isEdit ? "Perbarui Artikel" : "Tulis Artikel"}
            </h1>
            <p className="admin-subtitle">
              Isi detail artikel teknologi yang ingin kamu publish.
            </p>
          </div>
        </div>
      </header>

      <div className="admin-form-card">
        <form className="admin-form admin-form-row" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="title">
              Judul
            </label>
            <input
              id="title"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perkembangan AI di 2025"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="category">
              Kategori
            </label>
            <select
              id="category"
              className="admin-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="thumbnail">
              URL Thumbnail (opsional)
            </label>
            <input
              id="thumbnail"
              className="admin-input"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="content">
              Konten
            </label>
            <textarea
              id="content"
              className="admin-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi berita di sini..."
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="admin-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => navigate("/admin/articles")}
            >
              Batal
            </button>
            <button type="submit" className="admin-button">
              {isEdit ? "Simpan Perubahan" : "Simpan Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
