import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuestPage from './pages/QuestPage';
import ProfilPage from './pages/ProfilPage';

export default function App() {
  return (
    <div className="app-shell mobile-frame">
      <Navbar />
      <main className="app app-main">
        <div className="responsive-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route
              path="*"
              element={
                <section className="panel not-found-panel">
                  <h1>Halaman tidak ditemukan</h1>
                  <p>Halaman yang kamu cari tidak tersedia.</p>
                  <Link to="/" className="button">Ke beranda</Link>
                </section>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}
