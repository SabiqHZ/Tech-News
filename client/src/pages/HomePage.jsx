import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArticles } from "../api/articleApi";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    </div>
  );
}
