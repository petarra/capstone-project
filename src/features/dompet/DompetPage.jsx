
import React from 'react';
import { useApp } from '../../context/AppContext';
import './dompet.css';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const namaTransaksi = {
  income: 'Penghasilan quest',
  topup: 'Top up',
  withdrawal: 'Penarikan',
};

export default function DompetPage() {
  const { user, transactions } = useApp();

  const transaksiSaya = (transactions || [])
    .filter((item) => item.userId === user?.id)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

  const saldo = transaksiSaya.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  return (
    <section className="dompet-container">
      <div className="dompet-heading">
        <span className="dompet-eyebrow">KAMPUSGIG WALLET</span>
        <h2>Dompet Saya</h2>
        <p>Saldo dan riwayat transaksi kamu.</p>
      </div>

      <div className="dompet-saldo-card">
        <span className="dompet-saldo-label">Saldo saat ini</span>
        <h3>{formatRupiah(saldo)}</h3>
        <p>Saldo dihitung dari transaksi akun ini.</p>
      </div>

      <div className="dompet-history">
        <div className="dompet-history-heading">
          <h3>Riwayat Transaksi</h3>
          <span>{transaksiSaya.length} transaksi</span>
        </div>

        {transaksiSaya.length === 0 ? (
          <div className="dompet-empty">
            <p>Belum ada transaksi.</p>
            <span>
              Penghasilan akan muncul setelah quest selesai
              dan transaksi dicatat.
            </span>
          </div>
        ) : (
          <div className="dompet-list">
            {transaksiSaya.map((item) => (
              <div className="dompet-item" key={item.id}>
                <div className="dompet-item-info">
                  <strong>
                    {namaTransaksi[item.type] || 'Transaksi'}
                  </strong>
                  <span>{formatTanggal(item.createdAt)}</span>
                  {item.questId && (
                    <small>ID Quest: {item.questId}</small>
                  )}
                </div>

                <strong
                  className={
                    Number(item.amount) >= 0
                      ? 'dompet-amount-positive'
                      : 'dompet-amount-negative'
                  }
                >
                  {Number(item.amount) > 0 ? '+' : ''}
                  {formatRupiah(Number(item.amount || 0))}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="dompet-note">
        Dompet menampilkan transaksi yang sudah tercatat.
        Pembayaran dan penarikan uang sungguhan belum tersedia.
      </p>
    </section>
  );
}
