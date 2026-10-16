import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuestCard from '../components/QuestCard';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { user, quests } = useApp();
  const availableQuests = quests.filter((quest) => (
    quest.status === 'tersedia' && quest.visibility !== 'private'
  ));
  // Nilai input Beranda bersifat lokal agar tidak muncul di kolom Navbar.
  const [homeQuery, setHomeQuery] = useState('');
  const normalizedQuery = homeQuery.trim().toLocaleLowerCase('id-ID');
  const visibleQuests = availableQuests.filter((quest) => {
    if (!normalizedQuery) return true;
    const searchableText = [quest.title, quest.category, quest.pickup, quest.destination, quest.status]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('id-ID');
    return normalizedQuery.split(/\s+/).every((word) => searchableText.includes(word));
  });

  return (
    <div className="home-page-layout">
      {/* Mobile Top Bar (Greeting khusus layar kecil) */}
      <header className="top-bar mobile-top-bar">
        <Link to="/profil" className="user-head">
          <img className="avatar" src="/student_avatar.jpg" alt="Profil demo" />
          <div>
            <h1>Hai, {user?.name || 'Teman'}!</h1>
            <p>📍 Universitas Tanjungpura</p>
          </div>
        </Link>
        <button className="icon-button" disabled aria-label="Notifikasi belum dibuat">🔔</button>
      </header>

      {/* Desktop & Tablet Welcome Banner */}
      <div className="desktop-welcome-banner">
        <div className="welcome-text-group">
          <h2>Hai, {user?.name || 'Mahasiswa UNTAN'}! 👋</h2>
          <p>Temukan quest seru di lingkungan kampus dan manfaatkan waktu luangmu.</p>
        </div>
        <div className="campus-badge-chip">
          <span className="badge-dot">●</span> 📍 Universitas Tanjungpura · Pontianak
        </div>
      </div>

      {/* Responsive Dashboard Grid */}
      <div className="home-dashboard-grid">
        {/* Kolom Konten Utama */}
        <div className="home-main-column">
          {/* Hero Banner */}
          <section className="hero">
            <div className="hero-text-side">
              <span className="hero-kicker">Cuan Mahasiswa Kampus</span>
              <h2>Waktu luang<br />jadi cuan</h2>
              <p>Temukan quest seru di sekitar kampusmu dan dapatkan upah.</p>
              <Link className="button light hero-cta" to="/quest">Cari Quest →</Link>
            </div>
            <div className="hero-image-side">
              <img src="/student_banner.jpg" alt="Mahasiswa di kampus" />
            </div>
          </section>

          {/* Search Row */}
          <div className="search-row">
            <div className="search-input-box">
              <span className="input-search-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                value={homeQuery}
                onChange={(event) => setHomeQuery(event.target.value)}
                placeholder="Cari quest di sekitar kampus (antar berkas, beli makan)..."
                aria-label="Cari quest di sekitar kampus"
              />
            </div>
            <button className="icon-button" disabled aria-label="Filter belum dibuat">☷</button>
          </div>

          {/* Categories */}
          <div className="categories-block">
            <div className="section-head">
              <h2>Kategori Pilihan</h2>
            </div>
            <div className="categories">
              {[
                ['🏛️', 'Kampus', 'Tugas & Panitia'],
                ['🛵', 'Antar', 'Titip & Kirim'],
                ['🍴', 'Makanan', 'Kantin & Kuliner'],
              ].map(([icon, label, note]) => (
                <div key={label} className="category-item">
                  <span className="category-icon">{icon}</span>
                  <b>{label}</b>
                  <small className="category-note">{note}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Quest Terdekat */}
          <div className="section-head">
            <div>
              <h2>Quest Terdekat</h2>
              <span className="muted">Peluang terbaru di area kampusmu</span>
            </div>
            <Link to="/quest" className="see-all-link">Lihat semua ›</Link>
          </div>

          <div className="quest-grid" aria-live="polite">
            {visibleQuests.slice(0, 3).map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
          {visibleQuests.length === 0 && (
            <div className="panel" role="status" style={{ padding: '20px', textAlign: 'center' }}>
              <strong>Quest tidak ditemukan</strong>
              <p className="muted">Coba kata kunci lain, misalnya “makanan”, “kampus”, atau “berkas”.</p>
              <button type="button" className="button outline-btn" onClick={() => setHomeQuery('')}>Hapus pencarian</button>
            </div>
          )}

          <p className="starter-note">Kerangka awal · data contoh · fitur bisnis belum dibuat</p>
        </div>

        {/* Kolom Sidebar (Tablet & Desktop) */}
        <aside className="home-sidebar-column">
          {/* Saldo Card */}
          <section className="saldo-card">
            <div className="saldo-top">
              <small>Saldo Kamu</small>
              <span className="online">● Online · demo</span>
            </div>
            <strong>Rp0</strong>
            <div className="saldo-footer">
              <Link to="/profil" className="saldo-link-btn">👛 Buka Dompet</Link>
              <small className="saldo-subtext">Akun Mitra UNTAN</small>
            </div>
          </section>

          {/* Jadwal Hari Ini */}
          <div className="panel schedule-panel">
            <div className="section-head section-head-compact">
              <h2>Jadwal Hari Ini</h2>
              <span className="muted">Contoh jadwal</span>
            </div>
            <div className="schedule">
              {[
                ['📖', 'Kuliah', '08.00–10.00', 'Gedung FKIP'],
                ['🧪', 'Praktikum', '13.00–15.00', 'Lab Komputer'],
                ['👥', 'Organisasi', '19.00–21.00', 'Sekretariat'],
              ].map(([icon, title, time, loc]) => (
                <div key={title} className="schedule-card">
                  <span className="schedule-emoji">{icon}</span>
                  <div className="schedule-detail">
                    <b>{title}</b>
                    <small className="schedule-hours">{time}</small>
                    <small className="schedule-room">{loc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Mahasiswa Card */}
          <div className="panel student-tips-panel">
            <div className="tips-badge">💡 Info KampusGig</div>
            <h3>Maksimalkan Penghasilan</h3>
            <p>Ambil quest saat jeda antar kuliah untuk menambah uang jajan tanpa mengganggu waktu belajar.</p>
            <div className="safe-guarantee">🛡️ Komunitas terverifikasi mahasiswa</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
