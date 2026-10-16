<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useApp } from '../../context/AppContext';
import './akun.css';

const countryCodes = [
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapura', flag: '🇸🇬' },
  { code: '+673', country: 'Brunei', flag: '🇧🇳' },
  { code: '+63', country: 'Filipina', flag: '🇵🇭' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+1', country: 'Amerika Serikat', flag: '🇺🇸' },
  { code: '+44', country: 'Inggris', flag: '🇬🇧' },
  { code: '+81', country: 'Jepang', flag: '🇯🇵' },
  { code: '+82', country: 'Korea Selatan', flag: '🇰🇷' },
  { code: '+966', country: 'Arab Saudi', flag: '🇸🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export default function AkunPage() {
  const { user, updateUser, logout } = useApp();
  const navigate = useNavigate();

  const hasNim = Boolean(user?.nim && user.nim.trim() && user.nim !== '—' && user.nim !== 'NIM contoh');

  // Local form state
  const [name, setName] = useState(user?.name || 'Mahasiswa UNTAN');
  const [role, setRole] = useState(user?.role || 'Mahasiswa');
  const [email, setEmail] = useState(user?.email || 'mahasiswa@untan.ac.id');
  const [nim, setNim] = useState(hasNim ? user.nim : '');

  // State nomor telepon & negara
  const [countryCode, setCountryCode] = useState(() => {
    if (user?.phone) {
      const found = countryCodes.find((c) => user.phone.startsWith(c.code));
      if (found) return found.code;
    }
    return '+62';
  });
  const [phone, setPhone] = useState(() => {
    if (user?.phone) {
      const found = countryCodes.find((c) => user.phone.startsWith(c.code));
      if (found) {
        return user.phone.slice(found.code.length).trim().replace(/\D/g, '');
      }
      return user.phone.replace(/\D/g, '');
    }
    return '';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State foto avatar profil
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSavedSuccess(false);

    setTimeout(() => {
      if (updateUser) {
        const fullPhone = phone.trim() ? `${countryCode} ${phone.trim()}` : '';
        updateUser({
          name: name.trim(),
          role: role,
          email: email.trim(),
          avatar: avatar || null,
          ...(hasNim ? { nim: nim.trim() } : { phone: fullPhone, nim: '' }),
        });
      }
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    }, 650);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (logout) logout();
    navigate('/login');
  };

  return (
    <section className="panel account-edit-card" id="edit-profile-section">
      <div className="section-head account-head">
        <div>
          <h2>
            <Icon icon="lucide:user-cog" width="20" height="20" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Edit Profil & Akun
          </h2>
          <p className="muted">Perbarui data identitas diri dan preferensi akun KampusGig Anda.</p>
        </div>
        <span className="role-chip-indicator">{role}</span>
      </div>

      {savedSuccess && (
        <div className="save-success-banner" role="status">
          <Icon icon="lucide:check-circle-2" width="18" height="18" />
          <span>Profil berhasil diperbarui dan disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="account-form-grid">
        {/* Upload Foto Profil */}
        <div className="form-group edit-avatar-group">
          <label className="form-label">Foto Profil</label>
          <div className="edit-avatar-container">
            <div className="avatar-preview-box">
              {avatar ? (
                <img src={avatar} alt="Preview Foto" className="avatar large edit-avatar-preview" />
              ) : (
                <div className="avatar large avatar-placeholder">
                  <Icon icon="lucide:circle-user-round" width="56" height="56" />
                </div>
              )}
            </div>
            <div className="avatar-upload-controls">
              <input
                id="upload-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <div className="avatar-btn-row">
                <label htmlFor="upload-avatar-input" className="button button-outline-upload">
                  <Icon icon="lucide:upload" width="16" height="16" />
                  <span>{avatar ? 'Ganti Foto' : 'Unggah Foto'}</span>
                </label>
                {avatar && (
                  <button
                    type="button"
                    className="button-ghost-danger"
                    onClick={() => setAvatar(null)}
                    title="Hapus foto profil"
                  >
                    <Icon icon="lucide:trash-2" width="16" height="16" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
              <p className="avatar-help-text">Format JPG, PNG atau WebP (Maks. 2MB)</p>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-name" className="form-label">Nama Lengkap</label>
          <div className="input-with-icon">
            <Icon icon="lucide:user" className="input-icon" width="18" height="18" />
            <input
              id="edit-name"
              type="text"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-role" className="form-label">Peran / Role</label>
          <div className="input-with-icon select-container">
            <Icon icon="lucide:briefcase" className="input-icon" width="18" height="18" />
            <select
              id="edit-role"
              className="text-input select-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Staff Kampus">Staff Kampus</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-email" className="form-label">Alamat Email</label>
          <div className="input-with-icon">
            <Icon icon="lucide:mail" className="input-icon" width="18" height="18" />
            <input
              id="edit-email"
              type="email"
              className="text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>
        </div>

        {hasNim ? (
          <div className="form-group">
            <label htmlFor="edit-nim" className="form-label">
              {role === 'Mahasiswa' ? 'Nomor Induk Mahasiswa (NIM)' : 'Nomor Induk Pegawai (NIP)'}
            </label>
            <div className="input-with-icon">
              <Icon icon="lucide:id-card" className="input-icon" width="18" height="18" />
              <input
                id="edit-nim"
                type="text"
                className="text-input"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: F1081201045"
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="edit-phone" className="form-label">
              Nomor Telepon
            </label>
            <div className="phone-input-container">
              <div className="country-code-picker">
                <select
                  className="profile-country-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Pilih Kode Negara"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
              <input
                id="edit-phone"
                type="tel"
                inputMode="numeric"
                className="text-input phone-text-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 81234567890"
              />
            </div>
          </div>
        )}

        <div className="account-form-actions">
          <button
            type="submit"
            className="button button-primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <Icon icon="lucide:loader-2" className="spin-animation" width="18" height="18" />
            ) : (
              <Icon icon="lucide:save" width="18" height="18" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
          <button
            type="button"
            className="button button-outline-danger"
            onClick={() => setShowLogoutModal(true)}
          >
            <Icon icon="lucide:log-out" width="18" height="18" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </form>

      {/* Modal Konfirmasi Logout di Halaman Profil */}
      {showLogoutModal && (
        <div className="logout-modal-backdrop" role="dialog" aria-modal="true">
          <div className="logout-modal-card">
            <div className="logout-modal-icon-badge">
              <Icon icon="lucide:log-out" width="28" height="28" />
            </div>
            <h3 className="logout-modal-title">Yakin ingin keluar?</h3>
            <p className="logout-modal-desc">
              Sesi Anda akan berakhir. Anda harus masuk kembali dengan email dan kata sandi untuk mengakses fitur KampusGig.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="button-secondary logout-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="button-danger logout-confirm-btn"
                onClick={handleConfirmLogout}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
=======

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './akun.css';

export default function AkunPage() {
  const { user, setUser } = useApp();
  const [mode, setMode] = useState('login');
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [role, setRole] = useState('worker');
  const [pesan, setPesan] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setPesan('');

    if (mode === 'register' && !nama.trim()) {
      setPesan('Nama lengkap wajib diisi.');
      return;
    }

    if (!nim.trim()) {
      setPesan('NIM wajib diisi.');
      return;
    }

    setUser({
      id: `demo-${Date.now()}`,
      name: nama.trim() || 'Mahasiswa UNTAN',
      nim: nim.trim(),
      role,
    });

    setPesan(
      mode === 'register'
        ? 'Akun demo berhasil dibuat.'
        : 'Berhasil masuk menggunakan akun demo.'
    );
  }

  function handleLogout() {
    setUser(null);
    setNama('');
    setNim('');
    setRole('worker');
    setMode('login');
    setPesan('Kamu sudah keluar dari akun.');
  }

  if (user) {
    return (
      <section className="panel akun-panel">
        <div className="akun-heading">
          <div>
            <span className="akun-eyebrow">ACCOUNT INFO</span>
            <h2>Informasi Akun</h2>
            <p>Kelola informasi akun KampusGig kamu.</p>
          </div>
          <span className="akun-status">Aktif</span>
        </div>

        <div className="akun-info-list">
          <div className="akun-info-item">
            <span>Nama pengguna</span>
            <strong>{user.name}</strong>
          </div>
          <div className="akun-info-item">
            <span>NIM</span>
            <strong>{user.nim}</strong>
          </div>
          <div className="akun-info-item">
            <span>Peran akun</span>
            <strong>
              {user.role === 'worker' ? 'Pekerja' : 'Pemesan'}
            </strong>
          </div>
          <div className="akun-info-item">
            <span>ID akun</span>
            <strong>{user.id}</strong>
          </div>
        </div>

        <p className="akun-demo-note">
          Ini akun simulasi frontend. Data belum tersimpan ke database.
        </p>

        
<button
  type="button"
  className="akun-button akun-button-danger"
  onClick={handleLogout}
>
  Keluar dari akun
</button>

<button
  type="button"
  className="akun-button akun-button-help"
  disabled
  title="Kontak admin belum tersedia"
>
  Help Us — Segera Hadir
</button>

      </section>
    );
  }

  return (
    <section className="panel akun-panel">
      <div className="akun-heading">
        <div>
          <span className="akun-eyebrow">ACCOUNT INFO</span>
          <h2>{mode === 'login' ? 'Selamat Datang!' : 'Buat Akun Demo'}</h2>
          <p>
            {mode === 'login'
              ? 'Masuk untuk melanjutkan ke KampusGig.'
              : 'Isi informasi berikut untuk mencoba KampusGig.'}
          </p>
        </div>
      </div>

      <div className="akun-mode-switch">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => {
            setMode('login');
            setPesan('');
          }}
        >
          Masuk
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => {
            setMode('register');
            setPesan('');
          }}
        >
          Daftar
        </button>
      </div>

      <form className="akun-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label>
            Nama lengkap
            <input
              type="text"
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </label>
        )}

        {mode === 'login' && (
          <label>
            Nama pengguna (opsional)
            <input
              type="text"
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              placeholder="Mahasiswa UNTAN"
            />
          </label>
        )}

        <label>
          NIM
          <input
            type="text"
            value={nim}
            onChange={(event) => setNim(event.target.value)}
            placeholder="Masukkan NIM"
            required
          />
        </label>

        <label>
          Peran akun
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="worker">Pekerja</option>
            <option value="client">Pemesan</option>
          </select>
        </label>

        <button type="submit" className="akun-button">
          {mode === 'login' ? 'Masuk ke KampusGig' : 'Buat Akun Demo'}
        </button>
      </form>

      {pesan && (
        <p className="akun-message" role="status">{pesan}</p>
      )}

      <p className="akun-demo-note">
        Akun ini hanya untuk demonstrasi frontend. NIM tidak diverifikasi,
        dan tidak ada password yang disimpan.
      </p>
>>>>>>> 94c6bc9 (feat: implement account info and wallet)
    </section>
  );
}
