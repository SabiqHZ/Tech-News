import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../api/articleApi";
import { fetchCategories } from "../api/categoryApi";

const BOOKMARK_KEY = "technews_bookmarks";
const PAGE_SIZE = 6;

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // cek admin
  const isAdmin =
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  // state admin form
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // state bookmark (localStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(BOOKMARK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();
  const handleReadClick = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault(); // cegah pindah ke /article/:id
      alert("Harap login terlebih dahulu untuk membaca detail berita.");
      navigate("/admin/login");
    }
  };

  // state search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState(""); // '' = semua

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id);

  const toggleBookmark = (article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === article.id);
      let next;
      if (exists) {
        next = prev.filter((b) => b.id !== article.id);
      } else {
        const minimal = {
          id: article.id,
          title: article.title,
          category_name: article.category_name,
          published_at: article.published_at,
          author: article.author,
          content: article.content,
          thumbnail_url: article.thumbnail_url,
          image_url: article.image_url,
        };
        next = [...prev, minimal];
      }
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      return next;
    });
  };

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const [articleRes, categoryData] = await Promise.all([
        fetchArticles(page, PAGE_SIZE),
        fetchCategories(),
      ]);

      // articleRes: { success, data, page, limit, total, totalPages }
      setArticles(articleRes.data || []);
      setCategories(categoryData || []);
      setCurrentPage(articleRes.page || page);
      setTotalPages(articleRes.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategoryId("");
    setContent("");
    setThumbnailUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !content) return;

    const payload = {
      title,
      category_id: Number(categoryId),
      thumbnail_url: thumbnailUrl || null,
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
      // reload halaman sekarang dari backend
      loadData(currentPage);
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
    setThumbnailUrl(article.thumbnail_url || "");
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await deleteArticle(id);

      // hapus juga dari bookmark (state + localStorage)
      setBookmarks((prev) => {
        const next = prev.filter((b) => b.id !== id);
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
        return next;
      });

      // reload halaman sekarang setelah delete
      loadData(currentPage);
    } catch (err) {
      console.error("Gagal hapus artikel", err);
      alert("Gagal menghapus artikel");
    }
  };

  // ====== FILTERING DI SINI (masih client-side, per halaman yang sedang ditampilkan) ======
  const filteredArticles = articles.filter((article) => {
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      (article.content || "").toLowerCase().includes(q);

    const matchesCategory =
      !filterCategoryId ||
      Number(filterCategoryId) === Number(article.category_id);

    return matchesSearch && matchesCategory;
  });

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadData(page);
  };

  return (
    <div className="page">
      {/* Header dengan Logo */}
      <div className="page-header">
        <h1 className="page-header__logo">Tech News</h1>
      </div>

      {/* Search Bar + Filter */}
      <div className="home-toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Cari berita teknologi (judul / isi)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="home-filter-row">
          <button
            type="button"
            className={
              "chip" + (filterCategoryId === "" ? " admin-button--ghost" : "")
            }
            onClick={() => setFilterCategoryId("")}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={
                "chip" +
                (String(filterCategoryId) === String(cat.id)
                  ? " admin-button--ghost"
                  : "")
              }
              onClick={() => setFilterCategoryId(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p style={{ color: "#64748b", margin: 0 }}>Memuat berita...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📰</div>
          <p className="empty-state__text">Tidak ada berita yang cocok</p>
          <p className="empty-state__subtext">
            Coba ubah kata kunci atau filter kategori
          </p>
        </div>
      ) : (
        <>
          <div className="article-list">
            {filteredArticles.map((article) => (
              <div key={article.id}>
                <article className="article-card">
                  {/* Image dengan Bookmark */}
                  <div className="article-card__image-wrapper">
                    <img
                      src={
                        article.thumbnail_url ||
                        article.image_url ||
                        `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop&q=80`
                      }
                      alt={article.title}
                      className="article-card__image"
                    />
                    <button
                      type="button"
                      className={
                        "bookmark-btn " +
                        (isBookmarked(article.id) ? "bookmark-btn--active" : "")
                      }
                      onClick={() => toggleBookmark(article)}
                      aria-label="Bookmark"
                    >
                      {isBookmarked(article.id) ? "★" : "☆"}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="article-card__body">
                    <div className="article-card-header">
                      <h2 className="article-card__title">{article.title}</h2>
                    </div>

                    <div className="article-card__meta">
                      {article.category_name && (
                        <span className="article-card__category">
                          {article.category_name}
                        </span>
                      )}
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <p className="article-card__excerpt">
                      {article.content?.slice(0, 120) || ""}...
                    </p>

                    <div className="article-card__footer">
                      <span className="article-card__author">
                        Oleh {article.author}
                      </span>
                      <Link
                        to={`/article/${article.id}`}
                        className="article-card__read-more"
                        onClick={handleReadClick}
                      >
                        Baca →
                      </Link>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => handleEditClick(article)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => handleDeleteClick(article.id)}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              margin: "16px 24px",
            }}
          >
            <button
              type="button"
              className="admin-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ← Sebelumnya
            </button>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              type="button"
              className="admin-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Berikutnya →
            </button>
          </div>
        </>
      )}

      {/* Admin Form */}
      {isAdmin && (
        <div className="admin-form-card">
          <p className="admin-badge">
            Admin · {editingId ? "Edit Artikel" : "Artikel Baru"}
          </p>
          <h2 className="profile-card__title" style={{ marginBottom: "16px" }}>
            {editingId ? "Perbarui Artikel" : "Tambah Artikel Cepat"}
          </h2>

          <form className="admin-form" onSubmit={handleSubmit}>
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
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="thumbnail">
                URL Thumbnail (opsional)
              </label>
              <input
                id="thumbnail"
                className="admin-input"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://contoh.com/gambar.jpg"
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
                {editingId ? "💾 Simpan Perubahan" : "🚀 Publish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
