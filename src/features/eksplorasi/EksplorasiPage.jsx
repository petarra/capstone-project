import React, { useMemo, useState } from 'react';
import QuestCard from '../../components/QuestCard';
import { useApp } from '../../context/AppContext';
import './eksplorasi.css';

const categories = [
  { value: 'all', label: 'Semua quest', icon: '🧭' },
  { value: 'dosen', label: 'Dosen', icon: '👨‍🏫' },
  { value: 'staff', label: 'Staff', icon: '🧑‍💼' },
  { value: 'mahasiswa', label: 'Mahasiswa', icon: '🎓' },
  { value: 'sekitar-kampus', label: 'Sekitar kampus', icon: '📍' },
  { value: 'antar-jemput', label: 'Antar-jemput', icon: '🛵' },
];

const clientTypeLabels = {
  dosen: 'Dosen',
  staff: 'Staff',
  staf: 'Staff',
  mahasiswa: 'Mahasiswa',
};

const formatPay = (pay) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(pay);

const formatSchedule = (scheduledAt) => {
  if (!scheduledAt) return '';
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return scheduledAt;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatScheduleDate = (scheduledAt) => {
  if (!scheduledAt) return '';
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(date);
};

function matchesCategory(quest, category) {
  if (category === 'all') return true;
  if (['dosen', 'staff', 'staf', 'mahasiswa'].includes(category)) {
    const clientType = String(quest.clientType || '').toLocaleLowerCase('id-ID');
    return clientType === category || (category === 'staff' && clientType === 'staf')
      || (category === 'staf' && clientType === 'staff');
  }
  return quest.jobType === category;
}

function matchesSearch(quest, searchTerm) {
  const queryTerms = searchTerm
    .trim()
    .toLocaleLowerCase('id-ID')
    .split(/\s+/)
    .filter(Boolean);

  if (queryTerms.length === 0) return true;

  const schedule = formatSchedule(quest.scheduledAt);
  const searchableText = [
    quest.title,
    quest.clientType,
    clientTypeLabels[quest.clientType],
    quest.jobType,
    categories.find((category) => category.value === quest.jobType)?.label,
    quest.category,
    quest.description,
    quest.pickup,
    quest.destination,
    quest.pay,
    formatPay(quest.pay),
    quest.scheduledAt,
    schedule,
    formatScheduleDate(quest.scheduledAt),
  ].filter(Boolean).join(' ').toLocaleLowerCase('id-ID');

  return queryTerms.every((term) => searchableText.includes(term));
}

export default function EksplorasiPage() {
  const { quests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredQuests = useMemo(
    () => quests.filter((quest) => (
      matchesCategory(quest, selectedCategory) && matchesSearch(quest, searchTerm)
    )),
    [quests, searchTerm, selectedCategory],
  );

  return (
    <section className="eksplorasi-page" aria-labelledby="eksplorasi-title">
      <header className="eksplorasi-heading">
        <div>
          <span className="eksplorasi-eyebrow">TEMUKAN PELUANG</span>
          <h2 id="eksplorasi-title">Eksplorasi pekerjaan</h2>
          <p>Cari quest berdasarkan pemesan, jenis tugas, upah, atau jadwal.</p>
        </div>
      </header>

      <label className="eksplorasi-search">
        <span aria-hidden="true">🔍</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Cari jenis tugas, pemesan, upah, atau jadwal..."
          aria-label="Cari pekerjaan berdasarkan kategori, deskripsi, upah, tanggal, atau waktu"
        />
        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm('')} aria-label="Hapus pencarian">
            Hapus
          </button>
        )}
      </label>
      <p className="eksplorasi-search-hint">Contoh: dosen, antar-jemput, Rp15.000, atau tanggal.</p>

      <section className="eksplorasi-categories" aria-labelledby="eksplorasi-categories-title">
        <div className="eksplorasi-section-heading">
          <div>
            <h3 id="eksplorasi-categories-title">Pilih kategori</h3>
            <p>Kategori pemesan dan jenis pekerjaan</p>
          </div>
        </div>
        <div className="eksplorasi-category-grid">
          {categories.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              className={`eksplorasi-category${selectedCategory === value ? ' is-selected' : ''}`}
              onClick={() => setSelectedCategory(value)}
              aria-pressed={selectedCategory === value}
            >
              <span className="eksplorasi-category-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="eksplorasi-results-heading" aria-live="polite">
        <h3>{selectedCategory === 'all' ? 'Pekerjaan tersedia' : categories.find((item) => item.value === selectedCategory)?.label}</h3>
        <span>{filteredQuests.length} pekerjaan</span>
      </div>

      {filteredQuests.length > 0 ? (
        <div className="quest-grid">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} showDetails />
          ))}
        </div>
      ) : (
        <div className="eksplorasi-empty" role="status">
          <span aria-hidden="true">🔎</span>
          <h3>Quest tidak ditemukan</h3>
          <p>Coba kata kunci atau kategori lain.</p>
        </div>
      )}
    </section>
  );
}
