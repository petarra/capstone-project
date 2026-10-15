import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user } = useApp() || {};

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
            <Link to="/quest" className="desktop-search-trigger" aria-label="Cari quest">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <span className="search-hint">Cari quest di sekitar kampus...</span>
              <kbd className="search-shortcut">/</kbd>
            </Link>

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
