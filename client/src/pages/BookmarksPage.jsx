import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BOOKMARK_KEY = "technews_bookmarks"; // PENTING: Harus sama dengan HomePage

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARK_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);
  const navigate = useNavigate();

  const handleReadClick = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      alert("Harap login terlebih dahulu untuk membaca detail berita.");
      navigate("/admin/login");
    }
  };

  const handleRemoveBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__logo">Bookmarks</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">⭐</div>
          <p className="empty-state__text">Belum ada bookmark</p>
          <p className="empty-state__subtext">
            Tekan tombol bintang (☆) pada berita di halaman Home untuk
            menyimpannya di sini
          </p>
        </div>
      ) : (
        <div className="article-list">
          {bookmarks.map((article) => (
            <div key={article.id}>
              <article className="article-card">
                {/* Image dengan Bookmark Button */}
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
                    className="bookmark-btn bookmark-btn--active"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveBookmark(article.id);
                    }}
                    aria-label="Remove Bookmark"
                    title="Hapus dari Bookmark"
                  >
                    ★
                  </button>
                </div>

                {/* Card Body */}
                <div className="article-card__body">
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
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>

                  <p className="article-card__excerpt">
                    {article.content?.slice(0, 120) || ""}...
                  </p>

                  <div className="article-card__footer">
                    <span className="article-card__author">
                      {article.author ? `Oleh ${article.author}` : ""}
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
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
