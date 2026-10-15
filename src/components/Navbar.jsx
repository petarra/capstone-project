import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user } = useApp() || {};

  const navItems = [
    { to: '/', icon: 'lucide:home', label: '' },
    { to: '/quest', icon: 'lucide:clipboard-list', label: '' },
    { to: '/profil', icon: 'lucide:user', label: '' },
  ];

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
              >
                <Icon icon={icon} className="nav-icon" width="18" height="18" aria-hidden="true" />
                <span className="nav-text">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="desktop-header-right">
            <Link to="/quest" className="desktop-search-trigger" aria-label="Cari quest">
              <Icon icon="lucide:search" className="search-icon" width="16" height="16" aria-hidden="true" />
              <span className="search-hint">Cari</span>
              <kbd className="search-shortcut">/</kbd>
            </Link>

            <button className="icon-button header-bell-btn" disabled aria-label="Notifikasi belum dibuat">
              <Icon icon="lucide:bell" width="18" height="18" aria-hidden="true" />
              <span className="bell-badge" aria-hidden="true"></span>
            </button>

            <Link to="/profil" className="desktop-user-pill" aria-label="Buka profil">
              <img className="avatar avatar-sm" src="/student_avatar.jpg" alt="Foto profil demo" />
              <div className="user-pill-info">
                <span className="user-pill-name">{user?.name || 'Mahasiswa UNTAN'}</span>
                <span className="user-pill-sub">
                  <Icon icon="lucide:map-pin" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                  UNTAN · Online
                </span>
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
            <Icon icon={icon} className="bottom-nav-icon" width="22" height="22" aria-hidden="true" />
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

