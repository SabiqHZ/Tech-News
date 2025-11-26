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
          Nama: <strong>Tst</strong>
          <br />
          NIM: <strong>2</strong>
        </p>

        <div className="profile-card__tag">
          <span>STACK</span>
          <span>React • PWA • Supabase</span>
        </div>
      </div>
    </div>
  );
}
