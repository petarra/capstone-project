import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, searchQuery, setSearchQuery } = useApp() || {};
  // Nilai input Navbar berdiri sendiri; tidak terikat ke input Beranda.
  const [navbarQuery, setNavbarQuery] = useState(searchQuery || '');
  const navigate = useNavigate();
  const location = useLocation();
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

  // Sinkronkan navbarQuery jika searchQuery di context berubah dari luar (misal tombol reset di halaman quest)
  useEffect(() => {
    if (location.pathname === '/quest') {
      setNavbarQuery((prev) => (prev !== (searchQuery || '') ? (searchQuery || '') : prev));
    }
  }, [searchQuery, location.pathname]);

  // Jika sudah berada di halaman quest: apapun yang diketik langsung menyaring tampilan tanpa perlu tekan Enter.
  // Jika di luar halaman quest: simpan input lokal saja, pencarian akan diarahkan ke quest saat menekan Enter.
  const handleSearchChange = (event) => {
    const val = event.target.value;
    setNavbarQuery(val);
    if (location.pathname === '/quest') {
      setSearchQuery?.(val);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Terapkan kata kunci
    setSearchQuery?.(navbarQuery.trim());
    // Arahkan ke halaman quest jika saat ini tidak berada di halaman quest
    if (location.pathname !== '/quest') {
      navigate('/quest');
    }
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
                onChange={handleSearchChange}
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
