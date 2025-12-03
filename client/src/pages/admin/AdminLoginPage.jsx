import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/client";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@technews.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const switchToRegister = () => {
    setMode("register");
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchToLogin = () => {
    setMode("login");
    setName("");
    // optional: isi default admin lagi
    setEmail("admin@technews.com");
    setPassword("admin123");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;

      if (mode === "login") {
        res = await apiClient.post("/auth/login", { email, password });
      } else {
        // mode register
        res = await apiClient.post("/auth/register", { name, email, password });
      }

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert(mode === "login" ? "Login gagal" : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Header sama seperti Home/Profile */}
      <div className="page-header">
        <h1 className="page-header__logo">
          {mode === "login" ? "Admin" : "Register"}
        </h1>
      </div>

      {/* Shell untuk center card */}
      <div className="admin-login-shell">
        <div className="admin-form-card admin-login-card">
          <p className="admin-badge">
            {mode === "login" ? "Admin Area" : "Buat Akun Pembaca"}
          </p>
          <h2 className="admin-login-title">
            {mode === "login" ? "Tech News Console" : "Daftar Akun Tech News"}
          </h2>
          <p className="admin-login-subtitle">
            {mode === "login"
              ? "Masuk sebagai admin untuk mengelola artikel dan kategori di halaman utama."
              : "Buat akun untuk menyimpan bookmark dan personalisasi pengalaman membaca."}
          </p>

          <form className="admin-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="name">
                  Nama
                </label>
                <input
                  id="name"
                  className="admin-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "register"}
                  placeholder="Nama lengkap"
                />
              </div>
            )}

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
                {loading
                  ? mode === "login"
                    ? "Masuk..."
                    : "Mendaftar..."
                  : mode === "login"
                  ? "Masuk"
                  : "Daftar"}
              </button>
            </div>
          </form>

          <p className="admin-login-footer">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  className="admin-login-link"
                  onClick={switchToRegister}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  className="admin-login-link"
                  onClick={switchToLogin}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  Masuk
                </button>
              </>
            )}
            <br />
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
