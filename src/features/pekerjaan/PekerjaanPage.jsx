import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BuktiModal from './BuktiModal';
import './pekerjaan.css';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

function labelStatus(status) {
    if (status === 'menunggu_verifikasi') {
        return 'Menunggu Verifikasi';
    }

    if (status === 'selesai') {
        return 'Selesai';
    }

    return 'Sedang Dikerjakan';
}

export default function PekerjaanPage() {
    const {
        user,
        quests,
        setQuests,
        kirimBukti,
        storageError,
    } = useApp();

    const [tab, setTab] = useState('aktif');
    const [selectedId, setSelectedId] = useState(null);
    const [pesan, setPesan] = useState('');
    const [error, setError] = useState('');

    const daftarQuest = Array.isArray(quests) ? quests : [];

    const pekerjaanSaya = user
        ? daftarQuest.filter((quest) => quest.workerId === user.id)
        : [];

    const pekerjaanAktif = pekerjaanSaya.filter((quest) => {
        return [
            'diambil',
            'dikerjakan',
            'menunggu_verifikasi',
        ].includes(quest.status);
    });

    const pekerjaanSelesai = pekerjaanSaya.filter((quest) => {
        return quest.status === 'selesai';
    });

    const pekerjaanDitampilkan =
        tab === 'aktif' ? pekerjaanAktif : pekerjaanSelesai;

    const selectedJob = pekerjaanSaya.find((quest) => {
        return quest.id === selectedId;
    });

    function tambahPekerjaanContoh() {
        if (!user) return;

        const contohId = `contoh-jobs-taken:${user.id}`;

        setQuests((sebelumnya) => {
            const sudahAda = sebelumnya.some((quest) => {
                return quest.id === contohId;
            });

            if (sudahAda) return sebelumnya;

            const pekerjaanBaru = {
                id: contohId,
                title: 'Antar berkas ke Perpustakaan UNTAN',
                category: 'antar',
                pickup: 'Fotokopi FKIP',
                destination: 'Perpustakaan UNTAN',
                pay: 15000,
                note: 'Titipkan berkas di meja penerima dan ambil foto bukti.',
                status: 'diambil',
                clientId: 'pemesan-contoh',
                workerId: user.id,
                isDemo: true,
            };

            return [...sebelumnya, pekerjaanBaru];
        });

        setTab('aktif');
        setError('');
        setPesan('Pekerjaan contoh berhasil ditambahkan.');
    }

    function bukaModal(id) {
        if (typeof kirimBukti !== 'function') {
            setError(
                'Fungsi kirimBukti belum tersedia. Masukkan kode AppContext.jsx yang baru.'
            );
            return;
        }

        setError('');
        setSelectedId(id);
    }

    function tutupModal() {
        setSelectedId(null);
    }

    function handleKirimBukti(proof) {
        if (!selectedJob || !user || !proof) return;

        if (
            !['diambil', 'dikerjakan'].includes(selectedJob.status)
        ) {
            setSelectedId(null);
            return;
        }

        kirimBukti({
            id: selectedJob.id,
            workerId: user.id,
            proof,
        });

        setSelectedId(null);
        setPesan(
            'Bukti berhasil dikirim. Quest sedang menunggu verifikasi.'
        );
    }

    if (!user) {
        return (
            <section className="pekerjaan-empty">
                <h3>Masuk terlebih dahulu</h3>
                <p>Pekerjaan yang kamu ambil akan muncul di sini.</p>
            </section>
        );
    }

    return (
        <section className="pekerjaan-root">
            <header className="pekerjaan-heading">
                <div>
                    <span className="pekerjaan-kicker">
                        JOBS TAKEN
                    </span>

                    <h2>Pekerjaan Saya</h2>

                    <p>
                        Kelola dan selesaikan quest yang sudah kamu ambil.
                    </p>
                </div>

                <span className="pekerjaan-count">
                    {pekerjaanAktif.length} aktif
                </span>
            </header>

            {storageError && (
                <p className="pekerjaan-error" role="alert">
                    {storageError}
                </p>
            )}

            {error && (
                <p className="pekerjaan-error" role="alert">
                    {error}
                </p>
            )}

            {pesan && (
                <div className="pekerjaan-notice" role="status">
                    <span>{pesan}</span>

                    <button
                        type="button"
                        aria-label="Tutup informasi"
                        onClick={() => setPesan('')}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="pekerjaan-tabs">
                <button
                    type="button"
                    className={tab === 'aktif' ? 'is-active' : ''}
                    aria-pressed={tab === 'aktif'}
                    onClick={() => setTab('aktif')}
                >
                    Aktif ({pekerjaanAktif.length})
                </button>

                <button
                    type="button"
                    className={tab === 'selesai' ? 'is-active' : ''}
                    aria-pressed={tab === 'selesai'}
                    onClick={() => setTab('selesai')}
                >
                    Selesai ({pekerjaanSelesai.length})
                </button>
            </div>

            {pekerjaanSaya.length === 0 && (
                <div className="pekerjaan-empty">
                    <span className="pekerjaan-empty-icon">
                        🎒
                    </span>

                    <h3>Belum ada pekerjaan yang diambil</h3>

                    <p>
                        Quest yang berhasil diambil melalui fitur Accept Job
                        akan muncul di sini.
                    </p>

                    <button
                        type="button"
                        className="pekerjaan-primary"
                        onClick={tambahPekerjaanContoh}
                    >
                        Coba Pekerjaan Contoh
                    </button>
                </div>
            )}

            {pekerjaanSaya.length > 0 &&
                pekerjaanDitampilkan.length === 0 && (
                    <div className="pekerjaan-empty">
                        <h3>
                            {tab === 'aktif'
                                ? 'Tidak ada pekerjaan aktif'
                                : 'Belum ada pekerjaan selesai'}
                        </h3>

                        <p>
                            {tab === 'aktif'
                                ? 'Pekerjaan yang selesai dapat dilihat di tab Selesai.'
                                : 'Selesaikan pekerjaan aktif dan kirim foto buktinya.'}
                        </p>
                    </div>
                )}

            <div className="pekerjaan-grid">
                {pekerjaanDitampilkan.map((quest) => (
                    <article
                        className="pekerjaan-card"
                        key={quest.id}
                    >
                        <div className="pekerjaan-card-top">
                            <span className="pekerjaan-category">
                                {quest.category || 'Quest'}
                            </span>

                            <span
                                className={[
                                    'pekerjaan-badge',
                                    quest.status === 'selesai' ? 'done' : '',
                                    quest.status === 'menunggu_verifikasi'
                                        ? 'pending'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {labelStatus(quest.status)}
                            </span>
                        </div>

                        <h3>{quest.title}</h3>

                        <strong className="pekerjaan-pay">
                            {formatRupiah(quest.pay)}
                        </strong>

                        <dl className="pekerjaan-location">
                            <div>
                                <dt>Lokasi ambil</dt>
                                <dd>{quest.pickup || 'Belum tersedia'}</dd>
                            </div>

                            <div>
                                <dt>Lokasi tujuan</dt>
                                <dd>
                                    {quest.destination || 'Belum tersedia'}
                                </dd>
                            </div>
                        </dl>

                        {quest.note && (
                            <p className="pekerjaan-note">
                                {quest.note}
                            </p>
                        )}

                        {quest.isDemo && (
                            <small className="pekerjaan-help">
                                Data pekerjaan contoh
                            </small>
                        )}

                        {['diambil', 'dikerjakan'].includes(
                            quest.status
                        ) && (
                                <button
                                    type="button"
                                    className="pekerjaan-primary pekerjaan-full"
                                    onClick={() => bukaModal(quest.id)}
                                >
                                    Selesaikan Quest
                                </button>
                            )}

                        {quest.status === 'menunggu_verifikasi' && (
                            <div
                                className="pekerjaan-pending"
                                role="status"
                            >
                                Bukti sudah terkirim. Menunggu verifikasi
                                pembuat quest.
                            </div>
                        )}

                        {quest.status === 'selesai' && (
                            <div className="pekerjaan-success">
                                ✓ Quest selesai. Penghasilan sudah tercatat.
                            </div>
                        )}

                        {quest.proof?.dataUrl && (
                            <details className="pekerjaan-proof">
                                <summary>Lihat foto bukti</summary>

                                <img
                                    src={quest.proof.dataUrl}
                                    alt={`Bukti penyelesaian ${quest.title}`}
                                />
                            </details>
                        )}
                    </article>
                ))}
            </div>

            {selectedJob &&
                ['diambil', 'dikerjakan'].includes(
                    selectedJob.status
                ) && (
                    <BuktiModal
                        job={selectedJob}
                        onClose={tutupModal}
                        onSubmit={handleKirimBukti}
                    />
                )}
        </section>
    );
}