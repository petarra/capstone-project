import React from 'react';
import { useApp } from '../context/AppContext';
import AkunPage from '../features/akun/AkunPage';
import DompetPage from '../features/dompet/DompetPage';

export default function ProfilPage() {
  const { user } = useApp();

  return (
    <div className="profil-page-layout">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Profil & Dompet</h1>
          <p className="muted">Kelola akun mahasiswa, preferensi, dan saldo dompet KampusGig kamu.</p>
        </div>
      </div>

      <div className="profil-dashboard-grid">
        {/* Kolom Kiri: Kartu Profil & Dompet */}
        <div className="profil-left-column">
          <section className="panel profile-card">
            <div className="avatar-container">
              <img className="avatar large" src="/student_avatar.jpg" alt="Profil demo" />
              <span className="verified-chip" title="Terverifikasi Mahasiswa UNTAN">✓</span>
            </div>
            <h2>{user?.name || 'Pengguna demo'}</h2>
            <p className="nim-text">NIM: {user?.nim || '—'}</p>
            <span className="tag verified-tag">🛵 Mitra Pekerja Kampus · demo</span>

            <div className="profile-highlights">
              <div className="highlight-item">
                <strong>4.9 ★</strong>
                <small>Rating Mitra</small>
              </div>
              <div className="highlight-separator" />
              <div className="highlight-item">
                <strong>12</strong>
                <small>Quest Selesai</small>
              </div>
              <div className="highlight-separator" />
              <div className="highlight-item">
                <strong>100%</strong>
                <small>Tepat Waktu</small>
              </div>
            </div>
          </section>

          <div className="wallet-wrapper">
            <div className="section-head">
              <h2>👛 Dompet KampusGig</h2>
            </div>
            <section className="saldo-card wallet-saldo-card">
              <div className="saldo-main">
                <small>Saldo Penghasilan · contoh</small>
                <strong>Rp0</strong>
              </div>
              <span className="online">● Aktif</span>
            </section>
            <DompetPage />
          </div>
        </div>

        {/* Kolom Kanan: Akun & Pengaturan Kampus */}
        <div className="profil-right-column">
          <AkunPage />

          <section className="panel campus-settings-card">
            <h3>Pengaturan & Bantuan Kampus</h3>
            <div className="settings-list-grid">
              <div className="settings-list-item">
                <span className="setting-icon">📅</span>
                <div className="setting-text">
                  <strong>Jadwal kuliah</strong>
                  <p>Sinkronisasi jadwal otomatis dengan portal Siakad UNTAN (segera hadir).</p>
                </div>
              </div>
              <div className="settings-list-item">
                <span className="setting-icon">📍</span>
                <div className="setting-text">
                  <strong>Lokasi Utama Kampus</strong>
                  <p>Kampus Utama UNTAN, Jl. Prof. Dr. H. Hadari Nawawi, Pontianak.</p>
                </div>
              </div>
              <div className="settings-list-item">
                <span className="setting-icon">🛡️</span>
                <div className="setting-text">
                  <strong>Pusat Bantuan & Keamanan</strong>
                  <p>Panduan etika quest, keamanan transaksi, dan pelaporan kendala.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
