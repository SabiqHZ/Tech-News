import { Link } from "react-router-dom";

export default function ProfilePage() {
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

      {/* Tombol login admin */}
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
    </div>
  );
}
