import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const icons = { makanan: '🍱', antar: '🛵', kampus: '🎓' };

const clientTypeLabels = {
  dosen: 'Dosen',
  staff: 'Staff',
  staf: 'Staff',
  mahasiswa: 'Mahasiswa',
};

const jobTypeLabels = {
  'sekitar-kampus': 'Sekitar kampus',
  'antar-jemput': 'Antar-jemput',
};

const statusLabels = {
  tersedia: 'Tersedia',
  'menunggu-konfirmasi': 'Menunggu konfirmasi',
  diambil: 'Sudah diambil',
  dikerjakan: 'Sedang dikerjakan',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
  dibatalkan: 'Dibatalkan',
};

export default function QuestCard({ quest, showDetails = false, onAccept, userId }) {
  const navigate = useNavigate();
  const formattedPay = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(quest.pay);
  const schedule = quest.scheduledAt ? new Date(quest.scheduledAt) : null;
  const formattedSchedule = schedule && !Number.isNaN(schedule.getTime())
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(schedule)
    : quest.scheduledAt;

  return (
    <article className="panel quest-card">
      <div className="card-top">
        <span className="quest-icon" aria-hidden="true">{icons[quest.category] || '📦'}</span>
        {showDetails ? (
          <span className={`quest-status quest-status-${quest.status}`}>
            {statusLabels[quest.status] || quest.status}
          </span>
        ) : (
          <span className={`tag tag-${quest.category}`}>{quest.category}</span>
        )}
      </div>
      <h3 className="quest-title">{quest.title}</h3>
      {showDetails && (
        <div className="eksplorasi-card-details">
          <div className="eksplorasi-card-badges">
            {quest.clientType && (
              <span className="eksplorasi-card-badge">
                Pemesan: {clientTypeLabels[quest.clientType] || quest.clientType}
              </span>
            )}
            {quest.requestedWorkerId && quest.status === 'menunggu-konfirmasi' && (
              <span className="eksplorasi-card-badge">Undangan khusus</span>
            )}
            {quest.jobType && (
              <span className="eksplorasi-card-badge">
                {jobTypeLabels[quest.jobType] || quest.jobType}
              </span>
            )}
          </div>
          {quest.description && <p className="eksplorasi-card-description">{quest.description}</p>}
          {formattedSchedule && (
            <p className="eksplorasi-card-schedule">
              <span>Jadwal</span>
              {formattedSchedule}
            </p>
          )}
        </div>
      )}
      <p className="quest-route">
        <span className="route-from">{quest.pickup}</span>
        <span className="route-sep" aria-hidden="true"> → </span>
        <span className="route-to">{quest.destination}</span>
      </p>
      <div className="quest-card-bottom">
        <div className="pay-wrap">
          <small className="pay-caption">Imbalan</small>
          <strong className="pay">{formattedPay}</strong>
        </div>
        {showDetails && quest.status === 'tersedia' && onAccept ? (
          <Button type="button" onClick={() => onAccept(quest.id)}>Ambil pekerjaan</Button>
        ) : showDetails && quest.workerId && quest.workerId === userId ? (
          <Button type="button" disabled>Sudah kamu ambil</Button>
        ) : showDetails ? (
          <Button
            disabled
            title="Pekerjaan ini sudah tidak tersedia"
          >
            {statusLabels[quest.status] || quest.status}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => navigate('/quest')}
            title="Lihat quest di halaman Quest"
          >
            Lihat Quest →
          </Button>
        )}
      </div>
    </article>
  );
}
