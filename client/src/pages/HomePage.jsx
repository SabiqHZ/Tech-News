import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../api/articleApi";
import { fetchCategories } from "../api/categoryApi";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // cek admin dari localStorage
  const isAdmin =
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  // state form admin
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null); // null = mode tambah
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");

  // state bookmark user
  const [bookmarks, setBookmarks] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articleData, categoryData] = await Promise.all([
        fetchArticles(),
        isAdmin ? fetchCategories() : Promise.resolve([]),
      ]);
      setArticles(articleData);
      setCategories(categoryData);
    } finally {
      setLoading(false);
    }
  };

  // load artikel & kategori
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load bookmark dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategoryId("");
    setContent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !content) return;

    const payload = {
      title,
      category_id: Number(categoryId),
      thumbnail_url: null,
      content,
      author: "Admin",
      status: "published",
    };

    try {
      if (editingId) {
        await updateArticle(editingId, payload);
      } else {
        await createArticle(payload);
      }
      resetForm();
      loadData();
    } catch (err) {
      console.error("Gagal simpan artikel", err);
      alert("Gagal menyimpan artikel");
    }
  };

  const handleEditClick = (article) => {
    setEditingId(article.id);
    setTitle(article.title || "");
    setCategoryId(article.category_id ? String(article.category_id) : "");
    setContent(article.content || "");
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Gagal hapus artikel", err);
      alert("Gagal menghapus artikel");
    }
  };

  // toggle bookmark user
  const handleToggleBookmark = (article) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.id === article.id);
      let updated;

      if (exists) {
        // hapus bookmark
        updated = prev.filter((b) => b.id !== article.id);
      } else {
        // simpan snapshot artikel ke bookmark
        const bookmarkData = {
          id: article.id,
          title: article.title,
          category_id: article.category_id,
          category_name: article.category_name,
          published_at: article.published_at,
          author: article.author,
          thumbnail_url: article.thumbnail_url,
          content: article.content,
        };
        updated = [...prev, bookmarkData];
      }

      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__accent" />
        <div>
          <h1 className="page-title">Tech News</h1>
          <p className="page-subtitle">
            Berita teknologi terbaru dalam satu genggaman.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="page-subtitle">Memuat berita...</p>
      ) : (
        <div className="article-list">
          {articles.map((article) => {
            const isBookmarked = bookmarks.some((b) => b.id === article.id);

            return (
              <div key={article.id}>
                <Link
                  to={`/article/${article.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <article className="article-card">
                    <h2 className="article-card__title">{article.title}</h2>

                    <div className="article-card__meta">
                      {article.category_name && (
                        <span className="article-card__category">
                          {article.category_name}
                        </span>
                      )}
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                      <span>• {article.author}</span>
                    </div>

                    <p className="article-card__excerpt">
                      {article.content?.slice(0, 110) || ""}...
                    </p>
                  </article>
                </Link>

                {/* Baris bawah kartu: bookmark user + tombol admin */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    marginTop: 4,
                    marginBottom: 8,
                  }}
                >
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    onClick={() => handleToggleBookmark(article)}
                  >
                    {isBookmarked ? "Hapus Bookmark" : "Bookmark"}
                  </button>

                  {isAdmin && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => handleEditClick(article)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => handleDeleteClick(article.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PANEL ADMIN: create + edit */}
      {isAdmin && (
        <div className="admin-form-card" style={{ marginTop: 18 }}>
          <p className="admin-badge">
            Admin · {editingId ? "Edit Artikel" : "Artikel Baru"}
          </p>
          <h2 className="profile-card__title">
            {editingId ? "Perbarui Artikel" : "Tambah Artikel Cepat"}
          </h2>

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
                placeholder="Judul artikel..."
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
              <label className="admin-label" htmlFor="content">
                Konten
              </label>
              <textarea
                id="content"
                className="admin-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis isi berita..."
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
                {editingId ? "Simpan Perubahan" : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
