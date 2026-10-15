import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import EksplorasiPage from '../features/eksplorasi/EksplorasiPage';
import PesananPage from '../features/pesanan/PesananPage';
import PekerjaanPage from '../features/pekerjaan/PekerjaanPage';
import ChatPage from '../features/chat/ChatPage';

export default function QuestPage() {
  const [role, setRole] = useState('worker');
  const [tab, setTab] = useState('open');
  const [chatOpen, setChatOpen] = useState(false);

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
              setTab('open');
            }}
          >
            <Icon icon="lucide:bike" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Mau Kerja (Mitra)
          </button>
          <button
            type="button"
            className={role === 'client' ? 'on' : ''}
            onClick={() => {
              setRole('client');
              setTab('order');
            }}
          >
            <Icon icon="lucide:megaphone" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Buat Quest (Pemesan)
          </button>
        </div>
      </div>

      <p className="starter-note">Pilihan peran hanya untuk preview kerangka, belum terhubung ke akun.</p>

      {/* Subtab navigasi fitur */}
      <div className="quest-subnav-row">
        <div className="seg subtab-seg">
          <button
            type="button"
            className={['open', 'order'].includes(tab) ? 'on' : ''}
            onClick={() => setTab(role === 'worker' ? 'open' : 'order')}
          >
            {role === 'worker' ? (
              <>
                <Icon icon="lucide:search" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Eksplorasi Quest
              </>
            ) : (
              <>
                <Icon icon="lucide:file-plus" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Buat Pesanan Baru
              </>
            )}
          </button>
          <button
            type="button"
            className={['active', 'mine'].includes(tab) ? 'on' : ''}
            onClick={() => setTab(role === 'worker' ? 'active' : 'mine')}
          >
            {role === 'worker' ? (
              <>
                <Icon icon="lucide:zap" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Sedang Dikerjakan
              </>
            ) : (
              <>
                <Icon icon="lucide:clipboard-list" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Pesanan Anda
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          className="button outline-btn quick-chat-trigger"
          onClick={() => setChatOpen(true)}
        >
          <Icon icon="lucide:message-square" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Percakapan Quest
        </button>
      </div>

      {/* Konten Tab Aktif */}
      <div className="quest-tab-content">
        {tab === 'open' ? (
          <EksplorasiPage />
        ) : tab === 'active' ? (
          <PekerjaanPage />
        ) : (
          <div className="order-page-wrap">
            <h2>{tab === 'order' ? 'Buat pesanan baru' : 'Daftar pesanan Anda'}</h2>
            <PesananPage />
          </div>
        )}
      </div>

      {/* Section info chat */}
      <section className="panel chat-entry">
        <div className="chat-entry-body">
          <div className="chat-entry-icon">
            <Icon icon="lucide:message-square" width="28" height="28" />
          </div>
          <div className="chat-entry-text">
            <h3>Percakapan quest terintegrasi</h3>
            <p>Nantinya chat dibuka dari pesanan atau pekerjaan terkait untuk koordinasi langsung antar mahasiswa.</p>
          </div>
          <button type="button" className="button" onClick={() => setChatOpen(true)}>
            Buka Simulasi Chat
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
                <span className="sheet-icon">
                  <Icon icon="lucide:message-square" width="20" height="20" />
                </span>
                <h3>Simulasi Percakapan Quest</h3>
              </div>
              <button
                autoFocus
                type="button"
                className="close-button"
                onClick={() => setChatOpen(false)}
                aria-label="Tutup jendela chat"
              >
                <Icon icon="lucide:x" width="18" height="18" />
              </button>
            </div>
            <div className="sheet-content-scroll">
              <ChatPage />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
