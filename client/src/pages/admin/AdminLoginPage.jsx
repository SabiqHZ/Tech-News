import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/client";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@technews.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Header sama seperti Home/Profile */}
      <div className="page-header">
        <h1 className="page-header__logo">Admin</h1>
      </div>

      {/* Shell untuk center card */}
      <div className="admin-login-shell">
        <div className="admin-form-card admin-login-card">
          <p className="admin-badge">Admin Area</p>
          <h2 className="admin-login-title">Tech News Console</h2>
          <p className="admin-login-subtitle">
            Masuk sebagai admin untuk mengelola artikel dan kategori di halaman
            utama.
          </p>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="admin-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="admin-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-button" disabled={loading}>
                {loading ? "Masuk..." : "Masuk"}
              </button>
            </div>
          </form>

          <p className="admin-login-footer">
            Kembali ke{" "}
            <Link to="/" className="admin-login-link">
              beranda
            </Link>{" "}
            atau{" "}
            <Link to="/profile" className="admin-login-link">
              profil
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
