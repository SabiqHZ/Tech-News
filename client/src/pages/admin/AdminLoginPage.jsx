import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <p className="admin-badge">Admin Area</p>
        <h1 className="admin-login-title">Tech News Console</h1>
        <p className="admin-login-subtitle">
          Masuk sebagai admin untuk mengelola artikel dan kategori.
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

          <button type="submit" className="admin-button" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
