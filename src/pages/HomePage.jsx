import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import QuestCard from '../components/QuestCard';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { user, quests } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);

  // Kategori definisi: [icon, label, kategoriKey, note]
  const categories = [
    ['lucide:graduation-cap', 'Kampus', 'kampus', 'Tugas & Panitia'],
    ['lucide:bike', 'Antar', 'antar', 'Titip & Kirim'],
    ['lucide:utensils', 'Makanan', 'makanan', 'Kantin & Kuliner'],
  ];

  // Filter quest berdasarkan kategori aktif
  const filteredQuests = activeCategory
    ? quests.filter((q) => q.category === activeCategory)
    : quests;

  const handleCategoryClick = (categoryKey) => {
    // Toggle: klik lagi untuk hapus filter
    setActiveCategory((prev) => (prev === categoryKey ? null : categoryKey));
  };

  return (
    <div className="home-page-layout">
      {/* Mobile Top Bar (Greeting khusus layar kecil) */}
      <header className="top-bar mobile-top-bar">
        <Link to="/profil" className="user-head">
          <img className="avatar" src="/student_avatar.jpg" alt="Profil demo" />
          <div>
            <h1>Hai, {user?.name || 'Teman'}!</h1>
            <p>
              <Icon icon="lucide:map-pin" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Universitas Tanjungpura
            </p>
          </div>
        </Link>
        <button className="icon-button" disabled aria-label="Notifikasi belum dibuat">
          <Icon icon="lucide:bell" width="18" height="18" />
        </button>
      </header>

      {/* Desktop & Tablet Welcome Banner */}
      <div className="desktop-welcome-banner">
        <div className="welcome-text-group">
          <h2>Hai, {user?.name || 'Mahasiswa UNTAN'}!</h2>
          <p>Temukan quest seru di lingkungan kampus dan manfaatkan waktu luangmu.</p>
        </div>
        <div className="campus-badge-chip">
          <span className="badge-dot">●</span>
          <Icon icon="lucide:map-pin" width="14" height="14" style={{ verticalAlign: 'middle' }} />
          Universitas Tanjungpura · Pontianak
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
              <Link className="button light hero-cta" to="/quest">
                Cari Quest
                <Icon icon="lucide:arrow-right" width="14" height="14" />
              </Link>
            </div>
            <div className="hero-image-side">
              <img src="/student_banner.jpg" alt="Mahasiswa di kampus" />
            </div>
          </section>

          {/* Search Row */}
          <div className="search-row">
            <div className="search-input-box">
              <span className="input-search-icon" aria-hidden="true">
                <Icon icon="lucide:search" width="16" height="16" />
              </span>
              <input
                disabled
                placeholder="Cari quest di sekitar kampus (antar berkas, beli makan)..."
                aria-label="Pencarian belum dibuat"
              />
            </div>
            <button className="icon-button" disabled aria-label="Filter belum dibuat">
              <Icon icon="lucide:sliders-horizontal" width="18" height="18" />
            </button>
          </div>

          {/* Categories — klik untuk filter quest */}
          <div className="categories-block">
            <div className="section-head">
              <h2>Kategori Pilihan</h2>
              {activeCategory && (
                <button
                  className="see-all-link"
                  onClick={() => setActiveCategory(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  Tampilkan semua
                </button>
              )}
            </div>
            <div className="categories">
              {categories.map(([icon, label, key, note]) => (
                <div
                  key={key}
                  className={`category-item ${activeCategory === key ? 'category-active' : ''}`}
                  onClick={() => handleCategoryClick(key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(key); }}
                  aria-pressed={activeCategory === key}
                >
                  <span className="category-icon">
                    <Icon icon={icon} width="24" height="24" />
                  </span>
                  <b>{label}</b>
                  <small className="category-note">{note}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Quest Terdekat */}
          <div className="section-head">
            <div>
              <h2>
                {activeCategory
                  ? `Quest ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
                  : 'Quest Terdekat'}
              </h2>
              <span className="muted">
                {activeCategory
                  ? `${filteredQuests.length} quest ditemukan`
                  : 'Peluang terbaru di area kampusmu'}
              </span>
            </div>
            <Link to="/quest" className="see-all-link">Lihat semua ›</Link>
          </div>

          <div className="quest-grid">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            ) : (
              <div className="empty-quest-msg">
                <Icon icon="lucide:search-x" width="32" height="32" />
                <p>Belum ada quest untuk kategori ini.</p>
              </div>
            )}
          </div>

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
              <Link to="/profil" className="saldo-link-btn">
                <Icon icon="lucide:wallet" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                Buka Dompet
              </Link>
            </div>
          </section>

          {/* Tips Mahasiswa Card */}
          <div className="panel student-tips-panel">
            <div className="tips-badge">
              <Icon icon="lucide:lightbulb" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Info KampusGig
            </div>
            <h3>Maksimalkan Penghasilan</h3>
            <p>Ambil quest saat jeda antar kuliah untuk menambah uang jajan tanpa mengganggu waktu belajar.</p>
            <div className="safe-guarantee">
              <Icon icon="lucide:shield-check" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Komunitas terverifikasi mahasiswa
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

