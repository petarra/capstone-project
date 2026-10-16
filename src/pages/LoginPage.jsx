import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useApp } from '../context/AppContext';

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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useApp();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Null');
  const [countryCode, setCountryCode] = useState('+62');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Feedback & error states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle submit Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan email Anda');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login({ email: email.trim(), password });
      setIsLoading(false);
      if (result && !result.success) {
        setErrorMessage(result.message || 'Akun belum terdaftar. Silakan buat akun terlebih dahulu.');
        return;
      }
      navigate('/');
    }, 450);
  };

  // Handle submit Register
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap Anda');
      return;
    }
    if (!role || role === 'Null') {
      setErrorMessage('Silakan pilih role');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Silakan masukkan nomor telepon');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan email Anda');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register({
        name: fullName.trim(),
        role: role,
        phone: `${countryCode} ${phone.trim()}`,
        email: email.trim(),
        password,
      });
      setIsLoading(false);
      navigate('/');
    }, 500);
  };

  // Helper untuk akun demo cepat
  const handleQuickDemo = (demoRole = 'Mahasiswa') => {
    setIsLoading(true);
    setTimeout(() => {
      register({
        name: demoRole === 'Mahasiswa' ? 'Mahasiswa UNTAN' : demoRole === 'Dosen' ? 'Dr. Dosen UNTAN' : 'Staff Kampus UNTAN',
        role: demoRole,
        phone: '+62 81234567890',
        email: demoRole === 'Mahasiswa' ? 'mahasiswa@untan.ac.id' : `${demoRole.toLowerCase()}@untan.ac.id`,
        password: 'password123',
      });
      setIsLoading(false);
      navigate('/');
    }, 300);
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-backdrop-glow" />

      {/* Main Split Card Layout */}
      <div className="login-split-card">
        {/* Kolom Kiri: Visual Banner (Sesuai Layout Gambar) */}
        <div className="login-visual-panel">
          <img
            src="/student_banner.jpg"
            alt="KampusGig UNTAN Atmosphere"
            className="login-banner-image"
          />
          <div className="login-visual-gradient-overlay" />

          {/* Top Header di dalam banner */}
          <div className="login-visual-top-bar">
            <div className="login-visual-logo">
              <span className="visual-logo-icon">
                <Icon icon="lucide:graduation-cap" width="22" height="22" />
              </span>
              <span className="visual-logo-text">KampusGig</span>
            </div>
          </div>

          {/* Bottom Captions & Dots Carousel */}
          <div className="login-visual-bottom">
            <h2 className="login-visual-headline">
              {mode === 'login'
                ? 'Menghubungkan Peluang, Mewujudkan Prestasi'
                : 'Mulai Langkah Baru di Kampus Tercinta'}
            </h2>
            <p className="login-visual-subtext">
              Platform kolaborasi dan quest mahasiswa Universitas Tanjungpura
            </p>

            {/* Pagination Dots Indicator */}
            <div className="login-carousel-dots" aria-hidden="true">
              <span className={`dot-bar ${mode === 'login' ? 'active' : ''}`} />
              <span className={`dot-bar ${mode === 'register' ? 'active' : ''}`} />
              <span className="dot-bar" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Area */}
        <div className="login-form-panel">
          {/* Header Judul & Switcher */}
          <div className="login-form-header">
            <h1 className="login-title">
              {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
            </h1>
            <p className="login-subtitle">
              {mode === 'login' ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    className="login-toggle-link"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                  >
                    Daftar di sini
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    className="login-toggle-link"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                  >
                    Masuk
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Alert Error / Sukses */}
          {errorMessage && (
            <div className="login-alert-box error" role="alert">
              <Icon icon="lucide:alert-circle" width="18" height="18" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="login-actual-form">
              {/* Field: Email */}
              <div className="form-field-group">
                <label htmlFor="login-email" className="field-label">
                  Email
                </label>
                <div className="field-input-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:mail" width="18" height="18" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-text-input"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Field: Password dengan Eye Toggle */}
              <div className="form-field-group">
                <div className="field-label-row">
                  <label htmlFor="login-password" className="field-label">
                    Kata Sandi
                  </label>
                </div>
                <div className="field-input-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:lock" width="18" height="18" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-text-input has-suffix"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="field-eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    <Icon
                      icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                      width="18"
                      height="18"
                    />
                  </button>
                </div>
              </div>

              {/* Remember me & forgot password */}
              <div className="form-extra-row">
                <label className="checkbox-custom-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox-input"
                    defaultChecked
                  />
                  <span className="checkbox-text">Ingat saya</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMessage('Silakan gunakan akun demo atau hubungi admin kampus.');
                  }}
                  className="forgot-password-link"
                >
                  Lupa sandi?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-primary-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon icon="lucide:loader-2" className="spin-animation" width="18" height="18" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <Icon icon="lucide:arrow-right" width="18" height="18" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form Registrasi */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="login-actual-form">
              {/* Field: Nama Lengkap */}
              <div className="form-field-group">
                <label htmlFor="reg-fullname" className="field-label">
                  Nama Lengkap
                </label>
                <div className="field-input-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:user" width="18" height="18" />
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    className="login-text-input"
                    placeholder="Masukkan nama lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Field: Role (dropdown) [kata2nya jangan diubah: 1. Mahasiswa, 2. Dosen, 3. Staff Kampus] */}
              <div className="form-field-group">
                <label htmlFor="reg-role" className="field-label">
                  Role
                </label>
                <div className="field-input-wrapper select-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:briefcase" width="18" height="18" />
                  </span>
                  <select
                    id="reg-role"
                    className="login-text-input login-select-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="Null">Pilih Role</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Dosen">Dosen</option>
                    <option value="Staff Kampus">Staff Kampus</option>
                  </select>
                  <span className="select-arrow-icon" aria-hidden="true">
                    <Icon icon="lucide:chevron-down" width="16" height="16" />
                  </span>
                </div>
              </div>

              {/* Field: Nomor Telepon (Bisa pilih negara, default Indonesia, hanya input angka berupa string) */}
              <div className="form-field-group">
                <label htmlFor="reg-phone" className="field-label">
                  Nomor Telepon
                </label>
                <div className="field-input-wrapper phone-input-wrapper">
                  <div className="country-code-select-box">
                    <select
                      className="country-code-select"
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
                    id="reg-phone"
                    type="tel"
                    inputMode="numeric"
                    className="login-text-input login-phone-input"
                    placeholder="Contoh: 81234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              {/* Field: Email */}
              <div className="form-field-group">
                <label htmlFor="reg-email" className="field-label">
                  Email
                </label>
                <div className="field-input-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:mail" width="18" height="18" />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    className="login-text-input"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Field: Password dengan Eye Toggle */}
              <div className="form-field-group">
                <label htmlFor="reg-password" className="field-label">
                  Kata Sandi
                </label>
                <div className="field-input-wrapper">
                  <span className="field-prefix-icon">
                    <Icon icon="lucide:lock" width="18" height="18" />
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-text-input has-suffix"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="field-eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    <Icon
                      icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                      width="18"
                      height="18"
                    />
                  </button>
                </div>
              </div>

              {/* Terms Checkbox persis seperti di gambar */}
              <div className="form-extra-row terms-row">
                <label className="checkbox-custom-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox-input"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  <span className="checkbox-text">
                    Saya menyetujui <span className="terms-link-text">Syarat & Ketentuan</span> KampusGig
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-primary-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon icon="lucide:loader-2" className="spin-animation" width="18" height="18" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun</span>
                    <Icon icon="lucide:user-plus" width="18" height="18" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Fill Pill (Untuk kemudahan pengujian) */}
          <div className="login-quick-demo-container">
            <span className="quick-demo-title">Pilihan Cepat Masuk Demo:</span>
            <div className="quick-demo-buttons-row">
              <button
                type="button"
                className="quick-demo-chip"
                onClick={() => handleQuickDemo('Mahasiswa')}
              >
                <Icon icon="lucide:graduation-cap" width="14" height="14" />
                <span>Mahasiswa</span>
              </button>
              <button
                type="button"
                className="quick-demo-chip"
                onClick={() => handleQuickDemo('Dosen')}
              >
                <Icon icon="lucide:book-open" width="14" height="14" />
                <span>Dosen</span>
              </button>
              <button
                type="button"
                className="quick-demo-chip"
                onClick={() => handleQuickDemo('Staff Kampus')}
              >
                <Icon icon="lucide:building-2" width="14" height="14" />
                <span>Staff Kampus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
