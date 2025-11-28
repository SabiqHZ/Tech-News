import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArticles, createArticle } from "../api/articleApi";
import { fetchCategories } from "../api/categoryApi";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // cek admin langsung dari localStorage
  const isAdmin =
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  // untuk form admin
  const [categories, setCategories] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newContent, setNewContent] = useState("");

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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCategoryId || !newContent) return;

    try {
      await createArticle({
        title: newTitle,
        category_id: Number(newCategoryId),
        thumbnail_url: null,
        content: newContent,
        author: "Admin",
        status: "published",
      });
      setNewTitle("");
      setNewCategoryId("");
      setNewContent("");
      loadData();
    } catch (err) {
      console.error("Gagal buat artikel", err);
      alert("Gagal membuat artikel");
    }
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
          {articles.map((article) => (
            <Link
              key={article.id}
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
                    {new Date(article.published_at).toLocaleDateString("id-ID")}
                  </span>
                  <span>• {article.author}</span>
                </div>

                <p className="article-card__excerpt">
                  {article.content?.slice(0, 110) || ""}...
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* PANEL ADMIN DI HALAMAN HOME */}
      {isAdmin && (
        <div className="admin-form-card" style={{ marginTop: 18 }}>
          <p className="admin-badge">Admin · Berita</p>
          <h2 className="profile-card__title">Tambah Artikel Cepat</h2>
          <form className="admin-form admin-form-row" onSubmit={handleCreate}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="newTitle">
                Judul
              </label>
              <input
                id="newTitle"
                className="admin-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul artikel..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="newCategory">
                Kategori
              </label>
              <select
                id="newCategory"
                className="admin-input"
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
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
              <label className="admin-label" htmlFor="newContent">
                Konten singkat
              </label>
              <textarea
                id="newContent"
                className="admin-textarea"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Tulis isi berita..."
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-button">
                Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
