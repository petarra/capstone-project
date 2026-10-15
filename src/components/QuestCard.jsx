import React from 'react';
import { Icon } from '@iconify/react';
import Button from './Button';

const icons = {
  makanan: 'lucide:utensils',
  antar: 'lucide:bike',
  kampus: 'lucide:graduation-cap',
};

export default function QuestCard({ quest }) {
  const formattedPay = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(quest.pay);

  return (
    <article className="panel quest-card">
      <div className="card-top">
        <span className="quest-icon" aria-hidden="true">
          <Icon icon={icons[quest.category] || 'lucide:package'} width="20" height="20" />
        </span>
        <span className={`tag tag-${quest.category}`}>{quest.category}</span>
      </div>
      <h3 className="quest-title">{quest.title}</h3>
      <p className="quest-route">
        <span className="route-from">{quest.pickup}</span>
        <span className="route-sep" aria-hidden="true">
          <Icon icon="lucide:arrow-right" width="12" height="12" />
        </span>
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
