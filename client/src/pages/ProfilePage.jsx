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
      {/* Header Clean */}
      <div className="page-header">
        <h1 className="page-header__logo">Profil</h1>
      </div>

      {/* Profile Info Card */}
      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-avatar">
            <span className="profile-avatar__icon">👤</span>
          </div>
          <h2 className="profile-name">User</h2>
          <p className="profile-role">
            {isAdmin ? (
              <span className="profile-badge profile-badge--admin">
                🔑 Administrator
              </span>
            ) : (
              <span className="profile-badge">📱 Pembaca</span>
            )}
          </p>
        </div>

        {/* About Section */}
        <div className="profile-section">
          <h3 className="profile-section__title">Tentang Tech News</h3>
          <p className="profile-section__text">
            Platform berita teknologi yang ringan, cepat, dan bisa di-install
            seperti aplikasi. Dapatkan update terkini seputar AI, Web
            Development, Cloud Computing, dan teknologi lainnya.
          </p>
        </div>

        {/* Admin Login Button */}
        {!isAdmin && (
          <div className="profile-actions">
            <Link to="/admin/login" className="profile-login-btn">
              <span className="profile-login-btn__icon">🔐</span>
              <span>Login sebagai Admin</span>
            </Link>
          </div>
        )}

        {/* Admin Dashboard */}
        {isAdmin && (
          <div className="admin-form-card">
            <div className="admin-header">
              <div>
                <p className="admin-badge">Admin Dashboard</p>
                <h2 className="profile-card__title">Konsol Admin</h2>
                <p className="profile-card__meta">
                  Kamu login sebagai <strong>admin</strong>. Kelola berita dan
                  kategori dari menu di bawah.
                </p>
              </div>
              <button
                type="button"
                className="admin-button"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>

            <div className="admin-quick-actions">
              <Link to="/" className="quick-action-card">
                <span className="quick-action-card__icon">📰</span>
                <div className="quick-action-card__content">
                  <span className="quick-action-card__title">
                    Kelola Berita
                  </span>
                  <span className="quick-action-card__desc">
                    Tambah, edit, dan hapus artikel
                  </span>
                </div>
                <span className="quick-action-card__arrow">→</span>
              </Link>

              <Link to="/categories" className="quick-action-card">
                <span className="quick-action-card__icon">📂</span>
                <div className="quick-action-card__content">
                  <span className="quick-action-card__title">
                    Kelola Kategori
                  </span>
                  <span className="quick-action-card__desc">
                    Atur kategori berita
                  </span>
                </div>
                <span className="quick-action-card__arrow">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
