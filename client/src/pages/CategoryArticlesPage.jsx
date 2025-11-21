import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticlesByCategory } from "../api/categoryApi";

export default function CategoryArticlesPage() {
  const { categoryId } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategoryArticles = async () => {
      try {
        const res = await fetchArticlesByCategory(categoryId);
        // catatan: di backend kita kirim { success, category, data } -> tapi tadi di api kita return res.data.data (array artikel aja)
        // jadi kalau kamu mau dapat nama kategori, ubah dulu backend atau api.
        setArticles(res);
        // sementara, biar simple, pakai categoryId sebagai label
        setCategoryName(categoryId);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat berita kategori");
      } finally {
        setLoading(false);
      }
    };

    loadCategoryArticles();
  }, [categoryId]);

  if (loading) return <p>Memuat berita...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Berita Kategori: {categoryName}</h1>
      {articles.length === 0 && <p>Belum ada berita di kategori ini.</p>}

      <ul>
        {articles.map((article) => (
          <li key={article.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/article/${article.id}`}>
              <h3>{article.title}</h3>
            </Link>
            <p>{article.published_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
