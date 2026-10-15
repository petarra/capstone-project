import React from 'react';
import FeaturePlaceholder from '../../components/FeaturePlaceholder';
import QuestCard from '../../components/QuestCard';
import { useApp } from '../../context/AppContext';

// Pencarian menggunakan query bersama dari kolom search yang sudah ada di Navbar/Beranda.
export default function EksplorasiPage() {
  const { quests, searchQuery } = useApp();
  const normalizedQuery = (searchQuery || '').trim().toLocaleLowerCase('id-ID');
  const visibleQuests = quests.filter((quest) => {
    if (quest.status !== 'tersedia') return false;
    if (!normalizedQuery) return true;
    const searchableText = [quest.title, quest.category, quest.pickup, quest.destination, quest.status]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('id-ID');
    return normalizedQuery.split(/\s+/).every((word) => searchableText.includes(word));
  });

  return (
    <>
      <FeaturePlaceholder
        owner={2}
        title="Eksplorasi quest"
        tasks={[
          'Pencarian berdasarkan judul dan filter kategori.',
          'Modal detail quest menggunakan props.',
          'Sediakan tempat tombol Ambil untuk integrasi anggota 4.',
        ]}
      />
      {visibleQuests.length > 0 ? (
        <div className="quest-grid" aria-live="polite">
          {visibleQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
        </div>
      ) : (
        <div className="panel" role="status" style={{ padding: '20px', textAlign: 'center' }}>
          <strong>{normalizedQuery ? 'Quest tidak ditemukan' : 'Belum ada quest tersedia'}</strong>
          <p className="muted">
            {normalizedQuery
              ? `Tidak ada quest yang cocok dengan “${searchQuery.trim()}”. Coba kata kunci lain.`
              : 'Quest yang tersedia akan muncul di sini.'}
          </p>
        </div>
      )}
    </>
  );
}
