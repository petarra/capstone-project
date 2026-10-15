import React from 'react';
import Button from './Button';

const icons = { makanan: '🍱', antar: '🛵', kampus: '🎓' };

export default function QuestCard({ quest }) {
  const formattedPay = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(quest.pay);

  return (
    <article className="panel quest-card">
      <div className="card-top">
        <span className="quest-icon" aria-hidden="true">{icons[quest.category] || '📦'}</span>
        <span className={`tag tag-${quest.category}`}>{quest.category}</span>
      </div>
      <h3 className="quest-title">{quest.title}</h3>
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
        <Button disabled title="Dikerjakan anggota 2 dan 4">
          Detail / Ambil — belum dibuat
        </Button>
      </div>
    </article>
  );
}
