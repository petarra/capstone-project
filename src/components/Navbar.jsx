import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, setSearchQuery } = useApp() || {};
  // Nilai input Navbar berdiri sendiri; tidak terikat ke input Beranda.
  const [navbarQuery, setNavbarQuery] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Shortcut '/' memfokuskan kolom pencarian yang sudah ada.
  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );
      if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Terapkan kata kunci hanya ketika pengguna menekan Enter/tombol submit.
    setSearchQuery(navbarQuery.trim());
    navigate('/quest');
  };

  const navItems = [
    { to: '/', icon: '⌂', label: 'Beranda' },
    { to: '/quest', icon: '▤', label: 'Quest' },
    { to: '/profil', icon: '♙', label: 'Profil' },
  ];

  return (
    <>
      {/* Header navigasi untuk Desktop & Tablet */}
      <header className="desktop-header" aria-label="Navigasi desktop">
        <div className="desktop-header-inner">
          <Link to="/" className="brand-logo" aria-label="KampusGig Beranda">
            <span className="brand-logo-icon">🎓</span>
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
              >
                <span className="nav-icon" aria-hidden="true">{icon}</span>
                <span className="nav-text">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="desktop-header-right">
            <form className="desktop-search-trigger" role="search" onSubmit={handleSearchSubmit}>
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                ref={searchInputRef}
                className="desktop-search-input"
                type="search"
                value={navbarQuery}
                onChange={(event) => setNavbarQuery(event.target.value)}
                placeholder="Cari quest di sekitar kampus..."
                aria-label="Cari quest di seluruh KampusGig"
              />
              <button className="search-submit-shortcut" type="submit" aria-label="Lihat hasil pencarian">
                <kbd className="search-shortcut">↵</kbd>
              </button>
            </form>

            <button className="icon-button header-bell-btn" disabled aria-label="Notifikasi belum dibuat">
              🔔
              <span className="bell-badge" aria-hidden="true"></span>
            </button>

            <Link to="/profil" className="desktop-user-pill" aria-label="Buka profil">
              <img className="avatar avatar-sm" src="/student_avatar.jpg" alt="Foto profil demo" />
              <div className="user-pill-info">
                <span className="user-pill-name">{user?.name || 'Mahasiswa UNTAN'}</span>
                <span className="user-pill-sub">📍 UNTAN · Online</span>
              </div>
            </Link>
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
          >
            <span className="bottom-nav-icon" aria-hidden="true">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
