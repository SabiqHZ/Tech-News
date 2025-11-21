import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../api/categoryApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClick = (id) => {
    navigate(`/categories/${id}`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__accent" />
        <div>
          <h1 className="page-title">Kategori</h1>
          <p className="page-subtitle">
            Jelajahi berita berdasarkan kategori teknologi.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="page-subtitle">Memuat kategori...</p>
      ) : (
        <div className="chip-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="chip"
              type="button"
              onClick={() => handleClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
