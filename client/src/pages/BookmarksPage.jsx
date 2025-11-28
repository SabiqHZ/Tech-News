import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

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

  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__accent" />
        <div>
          <h1 className="page-title">Bookmarks</h1>
          <p className="page-subtitle">
            Berita yang kamu simpan untuk dibaca lagi nanti.
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <p className="page-subtitle" style={{ marginTop: 12 }}>
          Belum ada berita yang di-bookmark. Bukalah halaman Home lalu tekan
          tombol <strong>Bookmark</strong> pada berita yang kamu suka.
        </p>
      ) : (
        <div className="article-list">
          {bookmarks.map((article) => (
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
                    {article.published_at && (
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    )}
                    {article.author && <span>• {article.author}</span>}
                  </div>

                  <p className="article-card__excerpt">
                    {article.content?.slice(0, 110) || ""}...
                  </p>
                </article>
              </Link>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 4,
                  marginBottom: 8,
                }}
              >
                <button
                  type="button"
                  className="admin-button admin-button--ghost"
                  onClick={() => handleRemoveBookmark(article.id)}
                >
                  Hapus Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
