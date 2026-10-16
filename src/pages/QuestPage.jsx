import React, { useState } from 'react';
import EksplorasiPage from '../features/eksplorasi/EksplorasiPage';
import PesananPage from '../features/pesanan/PesananPage';
import PekerjaanPage from '../features/pekerjaan/PekerjaanPage';
import ChatPage from '../features/chat/ChatPage';
import { demoClient, demoWorkers } from '../data/dummyData';
import { useApp } from '../context/AppContext';

export default function QuestPage() {
  const { user, setUser } = useApp();
  const [role, setRole] = useState('worker');
  const [previewWorkerId, setPreviewWorkerId] = useState(demoWorkers[0].id);
  const [tab, setTab] = useState('open');
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatQuestId, setActiveChatQuestId] = useState('');

  const handleOpenChat = (questId = '') => {
    setActiveChatQuestId(questId);
    setChatOpen(true);
  };

  return (
    <div className="quest-page-layout">
      {/* Header bar halaman Quest */}
      <div className="quest-header-bar">
        <div>
          <h1 className="page-title">Quest Kampus</h1>
          <p className="muted">Temukan peluang cuan atau kelola quest tugas dan bantuan kampus.</p>
        </div>

        {/* Pemilihan Peran */}
        <div className="seg role-seg" aria-label="Preview peran">
          <button
            type="button"
            className={role === 'worker' ? 'on' : ''}
            onClick={() => {
              setRole('worker');
              setUser(demoWorkers.find((worker) => worker.id === previewWorkerId) || demoWorkers[0]);
              setTab('open');
            }}
          >
            🛵 Mau Kerja (Mitra)
          </button>
          <button
            type="button"
            className={role === 'client' ? 'on' : ''}
            onClick={() => {
              setRole('client');
              setUser(demoClient);
              setTab('order');
            }}
          >
            📢 Buat Quest
          </button>
        </div>
      </div>

      <p className="starter-note">Mode demo: pilih identitas pekerja untuk mencoba undangan kerja langsung.</p>
      {role === 'worker' && (
        <label className="quest-preview-worker">
          Preview sebagai pekerja
          <select
            value={user.role === 'worker' ? user.id : previewWorkerId}
            onChange={(event) => {
              setPreviewWorkerId(event.target.value);
              setUser(demoWorkers.find((worker) => worker.id === event.target.value) || demoWorkers[0]);
            }}
          >
            {demoWorkers.map((worker) => (
              <option key={worker.id} value={worker.id}>{worker.name}</option>
            ))}
          </select>
        </label>
      )}

      {/* Subtab navigasi fitur */}
      <div className="quest-subnav-row">
        <div className="seg subtab-seg">
          <button
            type="button"
            className={['open', 'order'].includes(tab) ? 'on' : ''}
            onClick={() => setTab(role === 'worker' ? 'open' : 'order')}
          >
            {role === 'worker' ? '🔍 Eksplorasi Quest' : '📝 Buat Pesanan'}
          </button>
          <button
            type="button"
            className={['active', 'mine'].includes(tab) ? 'on' : ''}
            onClick={() => setTab(role === 'worker' ? 'active' : 'mine')}
          >
            {role === 'worker' ? '⚡ Sedang Dikerjakan' : '📋 Pesanan Anda'}
          </button>
        </div>

        <button
          type="button"
          className="button outline-btn quick-chat-trigger"
          onClick={() => handleOpenChat('')}
        >
          💬 Percakapan Quest
        </button>
      </div>

      {/* Konten Tab Aktif */}
      <div className="quest-tab-content">
        {tab === 'open' ? (
          <EksplorasiPage />
        ) : tab === 'active' ? (
          <PekerjaanPage onOpenChat={handleOpenChat} />
        ) : (
          <div className="order-page-wrap">
            <h2>
              {tab === 'order' ? 'Buat pesanan' : 'Daftar pesanan Anda'}
            </h2>

            <PesananPage
              mode={tab === 'order' ? 'create' : 'mine'}
              onViewOrders={() => setTab('mine')}
              onOpenChat={handleOpenChat}
            />
          </div>
        )}
      </div>

      {/* Section info chat */}
      <section className="panel chat-entry">
        <div className="chat-entry-body">
          <div className="chat-entry-icon">💬</div>
          <div className="chat-entry-text">
            <h3>Percakapan quest terintegrasi</h3>
            <p>Koordinasi langsung dengan pemesan atau mitra pekerja pada setiap quest kamu secara real-time.</p>
          </div>
          <button type="button" className="button" onClick={() => handleOpenChat('')}>
            Buka Semua Percakapan
          </button>
        </div>
      </section>

      {/* Modal Dialog Chat */}
      {chatOpen && (
        <div className="overlay" onClick={() => setChatOpen(false)}>
          <section
            className="sheet chat-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Kerangka chat"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sheet-top-bar">
              <div className="sheet-title-group">
                <span className="sheet-icon">💬</span>
                <h3>Percakapan Quest</h3>
              </div>
              <button
                autoFocus
                type="button"
                className="close-button"
                onClick={() => setChatOpen(false)}
                aria-label="Tutup jendela chat"
              >
                ✕
              </button>
            </div>
            <div className="sheet-content-scroll">
              <ChatPage initialQuestId={activeChatQuestId} onClose={() => setChatOpen(false)} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
