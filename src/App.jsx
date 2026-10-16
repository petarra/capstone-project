import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuestPage from './pages/QuestPage';
import ProfilPage from './pages/ProfilPage';
import LoginPage from './pages/LoginPage';
import { useApp } from './context/AppContext';

export default function App() {
  const { user } = useApp();

  return (
    <div className={`app-shell mobile-frame ${!user ? 'auth-mode' : ''}`}>
      {user && <Navbar />}
      <main className={`app app-main ${!user ? 'auth-main' : ''}`}>
        <div className={user ? 'responsive-container' : 'auth-responsive-container'}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/quest"
              element={user ? <QuestPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profil"
              element={user ? <ProfilPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="*"
              element={
                user ? (
                  <section className="panel not-found-panel">
                    <h1>Halaman tidak ditemukan</h1>
                    <p>Halaman yang kamu cari tidak tersedia.</p>
                    <Link to="/" className="button">Ke beranda</Link>
                  </section>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

