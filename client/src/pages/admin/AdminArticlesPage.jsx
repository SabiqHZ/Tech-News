import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArticles, deleteArticle } from "../../api/articleApi";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      console.error("Gagal load artikel admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await deleteArticle(id);
      // refresh list
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Gagal hapus artikel", err);
      alert("Gagal menghapus artikel");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="page-header__accent" />
          <div>
            <p className="admin-badge">Konten</p>
            <h1 className="admin-title">Artikel</h1>
            <p className="admin-subtitle">Kelola semua artikel tech news.</p>
          </div>
        </div>

        <Link to="/admin/articles/new" className="admin-button">
          + Artikel baru
        </Link>
      </header>

      {loading ? (
        <p className="admin-subtitle">Memuat artikel...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Dipublish</th>
                <th style={{ width: "120px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const isPublished = !!article.published_at;
                return (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>{article.category_name || "-"}</td>
                    <td>
                      <span
                        className={
                          "admin-pill " +
                          (isPublished
                            ? "admin-pill--published"
                            : "admin-pill--draft")
                        }
                      >
                        {isPublished ? "published" : "draft"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          className="admin-button admin-button--ghost"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="admin-button admin-button--ghost"
                          onClick={() => handleDelete(article.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4}>Belum ada artikel.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
