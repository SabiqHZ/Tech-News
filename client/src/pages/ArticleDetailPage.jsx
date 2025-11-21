import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (loading) return <p>Memuat detail...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Berita tidak ditemukan</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>Dipublish: {article.published_at}</p>
      <p>Penulis: {article.author}</p>
      <hr />
      <p>{article.content}</p>
    </div>
  );
}
