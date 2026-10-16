
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
            <div className="profile-card-header">
              <div className="profile-avatar-wrapper">
                {user?.avatar ? (
                  <img className="profile-avatar" src={user.avatar} alt={user?.name || 'Profil'} />
                ) : (
                  <div className="profile-avatar" aria-label="Avatar profil">
                    {(user?.name || 'K').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="profile-verified-badge" title="Terverifikasi Mahasiswa UNTAN">✓</span>
              </div>

              <div className="profile-basic-info">
                <h2>{user?.name || 'Pengguna KampusGig'}</h2>
                <p>
                  {user?.nim && user.nim.trim() && user.nim !== '—' && user.nim !== 'NIM contoh'
                    ? `NIM: ${user.nim}`
                    : (user?.phone ? `No. Telp: ${user.phone}` : 'NIM: Belum diisi')}
                </p>
                <div className="profile-role-badge">
                  <span className="profile-role-dot" />
                  {user
                    ? user.role === 'client'
                      ? 'Pemberi Quest (Pemesan)'
                      : user.role === 'Dosen'
                        ? 'Dosen UNTAN'
                        : user.role === 'Staff Kampus'
                          ? 'Staff Kampus'
                          : 'Mitra Pekerja Kampus'
                    : 'Tamu (Belum Masuk)'}
                </div>
              </div>
            </div>

            {/* Statistik Sorotan Profil */}
            <div className="profile-highlights">
              <div className="profile-highlight-item">
                <strong>
                  4.9 <Icon icon="lucide:star" width="14" height="14" style={{ verticalAlign: 'middle', color: '#f59e0b', display: 'inline-block' }} />
                </strong>
                <span>Rating Mitra</span>
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
                <span className="setting-icon">
                  <Icon icon="lucide:map-pin" width="22" height="22" />
                </span>
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
                <span className="setting-icon">
                  <Icon icon="lucide:calendar" width="22" height="22" />
                </span>
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

