import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("token") && localStorage.getItem("role") === "admin"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAdmin(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__accent" />
        <div>
          <h1 className="page-title">Tentang Aplikasi</h1>
          <p className="page-subtitle">
            Tech News PWA — platform berita teknologi yang ringan, cepat, dan
            bisa di-install seperti aplikasi.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <h2 className="profile-card__title">Developer</h2>
        <p className="profile-card__meta">
          Nama: <strong>[Nama Kamu]</strong>
          <br />
          NIM: <strong>[NIM Kamu]</strong>
          <br />
          Kelas: <strong>[Kelas Kamu]</strong>
        </p>

        <div className="profile-card__tag">
          <span>STACK</span>
          <span>React • PWA • Supabase</span>
        </div>
      </div>

      {/* Kalau belum admin → tombol Login */}
      {!isAdmin && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link to="/admin/login" className="admin-button">
            Login Admin
          </Link>
        </div>
      )}

      {/* MINI DASHBOARD + LOGOUT kalau admin */}
      {isAdmin && (
        <div className="admin-form-card" style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <div>
              <p className="admin-badge">Admin dashboard</p>
              <h2 className="profile-card__title">Konsol Admin</h2>
              <p className="profile-card__meta">
                Kamu login sebagai <strong>admin</strong>. Kelola berita di
                halaman <strong>Home</strong>, dan kategori di halaman{" "}
                <strong>Kategori</strong>.
              </p>
            </div>

            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="chip-row" style={{ marginTop: 12 }}>
            <Link to="/" className="chip">
              Buka Home (kelola berita)
            </Link>
            <Link to="/categories" className="chip">
              Buka Kategori (kelola kategori)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
