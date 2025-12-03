import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticleById } from "../api/articleApi";

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleById(articleId);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail berita");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="article-detail-loading">
        <div className="article-detail-loading-spinner"></div>
        <p className="article-detail-loading-text">Memuat detail berita...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-detail-error">
        <div className="article-detail-error-icon">⚠️</div>
        <p className="article-detail-error-text">{error}</p>
        <Link
          to="/"
          className="article-detail-back"
          style={{ marginTop: "20px" }}
        >
          ← Kembali ke Home
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-notfound">
        <div className="article-detail-notfound-icon">📰</div>
        <p className="article-detail-notfound-text">Berita tidak ditemukan</p>
        <Link
          to="/"
          className="article-detail-back"
          style={{ marginTop: "20px" }}
        >
          ← Kembali ke Home
        </Link>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <Link to="/" className="article-detail-back">
        ← Kembali
      </Link>

      <article className="article-detail-header">
        {article.category_name && (
          <span className="article-detail-category">
            {article.category_name}
          </span>
        )}

        <h1 className="article-detail-title">{article.title}</h1>

        <div className="article-detail-meta">
          <div className="article-detail-meta-item">
            <span className="article-detail-meta-icon">📅</span>
            <span className="article-detail-meta-label">
              {new Date(article.published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {article.author && (
            <div className="article-detail-meta-item">
              <span className="article-detail-meta-icon">✍️</span>
              <span className="article-detail-meta-label">
                {article.author}
              </span>
            </div>
          )}
        </div>

        {(article.thumbnail_url || article.image_url) && (
          <img
            src={
              article.thumbnail_url ||
              article.image_url ||
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop&q=80"
            }
            alt={article.title}
            className="article-detail-image"
          />
        )}
      </article>

      <div className="article-detail-content">
        {article.content?.split("\n").map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
