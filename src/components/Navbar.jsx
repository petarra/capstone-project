import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useApp() || {};
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { to: '/', icon: 'lucide:home', label: 'Beranda' },
    { to: '/quest', icon: 'lucide:clipboard-list', label: 'Quest' },
    { to: '/profil', icon: 'lucide:user', label: 'Profil' },
  ];

  // 1. TAMBAHKAN STATE & REF UNTUK PENCARIAN DI SINI
  const [navbarQuery, setNavbarQuery] = useState('');
  const searchInputRef = useRef(null);

  // 2. TAMBAHKAN FUNGSI SUBMIT PENCARIAN
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navbarQuery.trim()) {
      // Contoh: Arahkan ke halaman quest dengan parameter query pencarian
      navigate(`/quest?search=${encodeURIComponent(navbarQuery)}`);
    }
  };

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Navigasi ke Edit Profil
  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profil');
  };

  // Buka Modal Konfirmasi Logout
  const handleOpenLogout = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  // Konfirmasi Logout
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      {/* Header navigasi untuk Desktop & Tablet */}
      <header className="desktop-header" aria-label="Navigasi desktop">
        <div className="desktop-header-inner">
          <Link to="/" className="brand-logo" aria-label="KampusGig Beranda">
            <span className="brand-logo-icon">
              <Icon icon="lucide:graduation-cap" width="22" height="22" />
            </span>
            <div className="brand-logo-text">
              <span className="brand-title">KampusGig</span>
              <span className="brand-tag">UNTAN</span>
            </div>
          </Link>

          <nav className="desktop-nav" aria-label="Menu navigasi desktop">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}
                title={label}
                aria-label={label}
              >
                <Icon icon={icon} className="nav-icon" width="20" height="20" aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <div className="desktop-header-right">
            <form className="desktop-search-trigger" role="search" onSubmit={handleSearchSubmit}>
              {/* Menggunakan ikon lucide:search dari desain awal agar CSS konsisten */}
              <Icon icon="lucide:search" className="search-icon" width="18" height="18" aria-hidden="true" />
              
              <input
                ref={searchInputRef}
                className="desktop-search-input"
                type="search"
                value={navbarQuery}
                onChange={(event) => setNavbarQuery(event.target.value)}
                placeholder="Cari quest"
                aria-label="Cari quest di seluruh KampusGig"
              />
              
              <button 
                className="search-submit-shortcut" 
                type="submit" 
                aria-label="Lihat hasil pencarian"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <kbd className="search-shortcut">↵</kbd>
              </button>
            </form>

            <button className="icon-button header-bell-btn" disabled aria-label="Notifikasi belum dibuat">
              <Icon icon="lucide:bell" width="18" height="18" aria-hidden="true" />
              <span className="bell-badge" aria-hidden="true"></span>
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className={`desktop-user-pill interactive ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Menu Pengguna"
              >
                {user?.avatar ? (
                  <img
                    className="avatar avatar-sm user-avatar-circle"
                    src={user.avatar}
                    alt="Foto profil"
                  />
                ) : (
                  <div className="avatar avatar-sm user-avatar-circle avatar-placeholder">
                    <Icon icon="lucide:circle-user-round" width="20" height="20" />
                  </div>
                )}
                <div className="user-pill-info">
                  <span className="user-pill-name">{user?.name || 'Mahasiswa UNTAN'}</span>
                  <span className="user-pill-sub">
                    <Icon icon="lucide:map-pin" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                    {user?.role || 'Mahasiswa'} · Online
                  </span>
                </div>
                <Icon
                  icon="lucide:chevron-down"
                  className={`user-pill-chevron ${isDropdownOpen ? 'rotated' : ''}`}
                  width="16"
                  height="16"
                  aria-hidden="true"
                />
              </button>

              {/* Drop Menu Kecil */}
              {isDropdownOpen && (
                <div className="profile-dropdown-menu" role="menu">
                  <div className="dropdown-user-header">
                    {user?.avatar ? (
                      <img className="avatar" src={user.avatar} alt="Foto profil" />
                    ) : (
                      <div className="avatar avatar-placeholder">
                        <Icon icon="lucide:circle-user-round" width="24" height="24" />
                      </div>
                    )}
                    <div className="dropdown-user-meta">
                      <strong className="dropdown-user-name">{user?.name || 'Pengguna UNTAN'}</strong>
                      <span className="dropdown-user-role-badge">{user?.role || 'Mahasiswa'}</span>
                      <small className="dropdown-user-email">{user?.email || 'nama@email.com'}</small>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    role="menuitem"
                    onClick={handleEditProfile}
                  >
                    <Icon icon="lucide:user-pen" className="dropdown-item-icon" width="18" height="18" />
                    <span>Edit Profil</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item item-logout"
                    role="menuitem"
                    onClick={handleOpenLogout}
                  >
                    <Icon icon="lucide:log-out" className="dropdown-item-icon danger-icon" width="18" height="18" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigasi bawah untuk Mobile */}
      <nav className="bottom-nav" aria-label="Navigasi utama">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
            title={label}
            aria-label={label}
          >
            <Icon icon={icon} className="bottom-nav-icon" width="24" height="24" aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      {/* Modal Konfirmasi Logout: "saat logout tambahkan yakin atau tidaknya" */}
      {showLogoutConfirm && (
        <div className="logout-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="logout-modal-card">
            <div className="logout-modal-icon-badge">
              <Icon icon="lucide:log-out" width="28" height="28" />
            </div>
            <h3 id="logout-title" className="logout-modal-title">Yakin ingin keluar?</h3>
            <p className="logout-modal-desc">
              Sesi Anda akan berakhir. Anda harus masuk kembali dengan email dan kata sandi untuk mengakses fitur KampusGig.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="button-secondary logout-cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
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
    </>
  );
}

