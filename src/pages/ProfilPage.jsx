
import React from 'react';
import { Icon } from '@iconify/react';
import { useApp } from '../context/AppContext';
import AkunPage from '../features/akun/AkunPage';
import DompetPage from '../features/dompet/DompetPage';
import './profil.css';

export default function ProfilPage() {
  const { user } = useApp();

  return (
    <div className="profil-page-layout">
      {/* Header Halaman Profil */}
      <div className="profil-page-header">
        <span className="profil-page-eyebrow">PROFIL & DOMPET</span>
        <h1>Profil Saya</h1>
        <p>Kelola informasi akun, peran mahasiswa, dan penghasilan dompet KampusGig kamu.</p>
      </div>

      <div className="profil-dashboard-grid">
        {/* Kolom kiri: Profil dan Dompet */}
        <div className="profil-left-column">
          {/* Kartu Profil Pengguna */}
          <section className="panel profile-card">
<<<<<<< HEAD
            <div className="avatar-container">
              {user?.avatar ? (
                <img className="avatar large" src={user.avatar} alt={user?.name || 'Profil'} />
              ) : (
                <div className="avatar large avatar-placeholder" aria-label="Default avatar">
                  <Icon icon="lucide:circle-user-round" width="56" height="56" />
                </div>
              )}
              <span className="verified-chip" title="Terverifikasi Mahasiswa UNTAN">
                <Icon icon="lucide:check" width="12" height="12" />
              </span>
            </div>
            <h2>{user?.name || 'Pengguna demo'}</h2>
            <p className="nim-text">
              {user?.nim && user.nim.trim() && user.nim !== '—' && user.nim !== 'NIM contoh'
                ? `NIM: ${user.nim}`
                : `No. Telp: ${user?.phone || '—'}`}
            </p>
            <span className="tag verified-tag">
              <Icon icon="lucide:bike" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Mitra Pekerja Kampus · demo
            </span>
=======
            <div className="profile-card-header">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar" aria-label="Avatar profil">
                  {(user?.name || 'K').charAt(0).toUpperCase()}
                </div>
                <span className="profile-verified-badge" title="Terverifikasi Mahasiswa UNTAN">✓</span>
              </div>
>>>>>>> 94c6bc9 (feat: implement account info and wallet)

              <div className="profile-basic-info">
                <h2>{user?.name || 'Pengguna KampusGig'}</h2>
                <p>NIM: {user?.nim || 'Belum diisi'}</p>
                <div className="profile-role-badge">
                  <span className="profile-role-dot" />
                  {user ? (user.role === 'client' ? 'Pemberi Quest (Pemesan)' : 'Mitra Pekerja Kampus') : 'Tamu (Belum Masuk)'}
                </div>
              </div>
            </div>

            {/* Statistik Sorotan Profil */}
            <div className="profile-highlights">
<<<<<<< HEAD
              <div className="highlight-item">
                <strong>
                  4.9 <Icon icon="lucide:star" width="14" height="14" style={{ verticalAlign: 'middle', color: '#f59e0b' }} />
                </strong>
                <small>Rating Mitra</small>
=======
              <div className="profile-highlight-item">
                <strong>4.9 ★</strong>
                <span>Rating</span>
>>>>>>> 94c6bc9 (feat: implement account info and wallet)
              </div>

              <div className="profile-highlight-divider" />

              <div className="profile-highlight-item">
                <strong>12</strong>
                <span>Quest Selesai</span>
              </div>

              <div className="profile-highlight-divider" />

              <div className="profile-highlight-item">
                <strong>100%</strong>
                <span>Respons</span>
              </div>
            </div>
          </section>

          {/* Saldo dan riwayat transaksi dari data Dompet */}
          <div className="wallet-wrapper">
<<<<<<< HEAD
            <div className="section-head">
              <h2>
                <Icon icon="lucide:wallet" width="18" height="18" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Dompet KampusGig
              </h2>
            </div>
            <section className="saldo-card wallet-saldo-card">
              <div className="saldo-main">
                <small>Saldo Penghasilan · contoh</small>
                <strong>Rp0</strong>
              </div>
              <span className="online">● Aktif</span>
            </section>
=======
>>>>>>> 94c6bc9 (feat: implement account info and wallet)
            <DompetPage />
          </div>
        </div>

        {/* Kolom kanan: Akun dan pengaturan */}
        <div className="profil-right-column">
          <AkunPage />

          {/* Pengaturan & Bantuan Kampus */}
          <section className="panel campus-settings-card">
            <div className="campus-settings-header">
              <span className="campus-settings-eyebrow">INFORMASI & BANTUAN</span>
              <h2>Pengaturan Kampus</h2>
              <p>
                Pusat informasi kampus UNTAN, panduan keamanan transaksi, dan integrasi akademik.
              </p>
            </div>

            <div className="settings-list-grid">
              <div className="settings-list-item">
<<<<<<< HEAD
                <span className="setting-icon">
                  <Icon icon="lucide:calendar" width="22" height="22" />
                </span>
                <div className="setting-text">
                  <strong>Jadwal kuliah</strong>
                  <p>Sinkronisasi jadwal otomatis dengan portal Siakad UNTAN (segera hadir).</p>
                </div>
              </div>
              <div className="settings-list-item">
                <span className="setting-icon">
                  <Icon icon="lucide:map-pin" width="22" height="22" />
                </span>
=======
                <span className="setting-icon">📍</span>
>>>>>>> 94c6bc9 (feat: implement account info and wallet)
                <div className="setting-text">
                  <strong>Lokasi Utama Kampus</strong>
                  <p>Kampus Utama UNTAN, Jl. Prof. Dr. H. Hadari Nawawi, Pontianak.</p>
                </div>
              </div>

              <div className="settings-list-item">
                <span className="setting-icon">
                  <Icon icon="lucide:shield-check" width="22" height="22" />
                </span>
                <div className="setting-text">
                  <strong>Pusat Bantuan & Keamanan</strong>
                  <p>Panduan etika quest, keamanan transaksi mahasiswa, dan pelaporan kendala.</p>
                </div>
              </div>

              <div className="settings-list-item">
                <span className="setting-icon">📅</span>
                <div className="setting-text">
                  <strong>Jadwal Kuliah (Siakad)</strong>
                  <p>Sinkronisasi jadwal otomatis dengan portal Siakad UNTAN (segera hadir).</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
