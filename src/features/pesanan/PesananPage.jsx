import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './pesanan.css';

const ONGKIR_PER_KM = 1000;

const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka || 0);

const initialForm = {
    title: '',
    description: '',
    category: 'makanan',
    pickup: '',
    destination: '',
    distanceKm: '',
    foodPrice: '',
    serviceFee: '2000',
    tip: '0',
};

export default function PesananPage({ mode = 'create', onViewOrders }) {
    const { user, quests, setQuests } = useApp();

    const [form, setForm] = useState(initialForm);
    const [deleteId, setDeleteId] = useState(null);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Mengambil nilai angka dari form
    const distanceKm = Number(form.distanceKm) || 0;
    const foodPrice =
        form.category === 'makanan'
            ? Number(form.foodPrice) || 0
            : 0;
    const serviceFee = Number(form.serviceFee) || 0;
    const tip = Number(form.tip) || 0;

    // Menghitung biaya
    const pay = serviceFee;
    const deliveryFee = distanceKm * ONGKIR_PER_KM;

    // Total seluruh biaya yang dibayar pemesan
    const totalCost = foodPrice + pay + deliveryFee + tip;

    // Imbalan mitra terdiri dari biaya jasa dan tips
    const partnerReward = pay + tip;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // Validasi kolom wajib
        if (
            !form.title.trim() ||
            !form.description.trim() ||
            !form.pickup.trim() ||
            !form.destination.trim() ||
            form.distanceKm === ''
        ) {
            setError('Lengkapi semua kolom wajib terlebih dahulu.');
            return;
        }

        if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
            setError('Jarak perjalanan harus lebih dari 0 km.');
            return;
        }

        if (
            form.category === 'makanan' &&
            (form.foodPrice === '' ||
                !Number.isFinite(Number(form.foodPrice)) ||
                Number(form.foodPrice) < 500)
        ) {
            setError('Harga makanan minimal Rp500.');
            return;
        }

        if (
            form.serviceFee === '' ||
            !Number.isFinite(Number(form.serviceFee)) ||
            Number(form.serviceFee) < 2000
        ) {
            setError('Biaya jasa mitra minimal Rp2.000.');
            return;
        }

        if (
            form.tip === '' ||
            !Number.isFinite(Number(form.tip)) ||
            Number(form.tip) < 0
        ) {
            setError('Tips harus berupa angka 0 atau lebih.');
            return;
        }

        // Membuat data quest baru
        const newQuest = {
            id: `q-${Date.now()}`,
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            pickup: form.pickup.trim(),
            destination: form.destination.trim(),
            location: `${form.pickup.trim()} → ${form.destination.trim()}`,
            distanceKm,
            foodPrice,
            pay,
            deliveryFee,
            tip,
            totalCost,
            partnerReward,
            clientId: user.id,
            clientName: user.name,
            status: 'tersedia',
            workerId: null,
        };

        setQuests((prev) => [newQuest, ...prev]);

        setForm({ ...initialForm });
        setShowSuccessModal(true);
    };

    const confirmDelete = () => {
        setQuests((prev) =>
            prev.filter((quest) => quest.id !== deleteId)
        );

        setDeleteId(null);
    };

    const myQuests = quests.filter(
        (quest) =>
            quest.clientId === user.id ||
            quest.clientId === 'client-demo'
    );

    if (mode === 'create') {
        return (
            <section className="pesanan-section">
                <form
                    className="pesanan-form"
                    onSubmit={handleSubmit}
                >
                    <div className="pesanan-field">
                        <label htmlFor="title">Judul Quest</label>
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Contoh: Belikan makan siang"
                            required
                        />
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="description">
                            Deskripsi Quest
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Jelaskan quest yang kamu butuhkan"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="category">Kategori Quest</label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option value="kampus">Kampus</option>
                            <option value="antar">Antar</option>
                            <option value="makanan">Makanan</option>
                        </select>
                    </div>

                    {form.category === 'makanan' && (
                        <div className="pesanan-field">
                            <label htmlFor="foodPrice">
                                Harga Makanan (Rp)
                            </label>
                            <input
                                id="foodPrice"
                                name="foodPrice"
                                type="number"
                                min="500"
                                step="any"
                                value={form.foodPrice}
                                onChange={handleChange}
                                placeholder="Minimal Rp500"
                                required
                            />
                            <small>
                                Harga makanan minimal Rp500.
                            </small>
                        </div>
                    )}

                    <div className="pesanan-field">
                        <label htmlFor="serviceFee">
                            Biaya Jasa Mitra (Rp)
                        </label>
                        <input
                            id="serviceFee"
                            name="serviceFee"
                            type="number"
                            min="2000"
                            step="any"
                            value={form.serviceFee}
                            onChange={handleChange}
                            placeholder="Minimal Rp2.000"
                            required
                        />
                        <small>
                            Biaya jasa mitra minimal Rp2.000. Nominal di bawah
                            batas minimum tidak diperbolehkan.
                        </small>
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="pickup">
                            Lokasi Penjemputan
                        </label>
                        <input
                            id="pickup"
                            name="pickup"
                            value={form.pickup}
                            onChange={handleChange}
                            placeholder="Contoh: Kantin UNTAN"
                            required
                        />
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="destination">
                            Lokasi Tujuan
                        </label>
                        <input
                            id="destination"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="Contoh: Fakultas Teknik UNTAN"
                            required
                        />
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="distanceKm">
                            Jarak Perjalanan (km)
                        </label>
                        <input
                            id="distanceKm"
                            name="distanceKm"
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={form.distanceKm}
                            onChange={handleChange}
                            placeholder="Contoh: 3.5"
                            required
                        />
                        <small>
                            Masukkan perkiraan jarak perjalanan dalam km.
                        </small>
                    </div>

                    <div className="pesanan-field">
                        <label htmlFor="tip">
                            Tips untuk Mitra (Rp, opsional)
                        </label>
                        <input
                            id="tip"
                            name="tip"
                            type="number"
                            min="0"
                            step="any"
                            value={form.tip}
                            onChange={handleChange}
                            placeholder="Masukkan 0 jika tidak ada tips"
                        />
                        <small>
                            Tips akan ditambahkan ke imbalan yang
                            diterima mitra.
                        </small>
                    </div>

                    <div className="pesanan-cost-summary">
                        <h3>Rincian Biaya Quest</h3>

                        {form.category === 'makanan' && (
                            <div className="pesanan-cost-row">
                                <span>Harga makanan </span>
                                <span>{formatRupiah(foodPrice)}</span>
                            </div>
                        )}

                        <div className="pesanan-cost-row">
                            <span>Biaya jasa mitra </span>
                            <span>{formatRupiah(pay)}</span>
                        </div>

                        <div className="pesanan-cost-row">
                            <span>Ongkos perjalanan </span>
                            <span>{formatRupiah(deliveryFee)}</span>
                        </div>

                        <div className="pesanan-cost-row">
                            <span>Tips untuk mitra </span>
                            <span>{formatRupiah(tip)}</span>
                        </div>

                        <div className="pesanan-cost-row pesanan-cost-total">
                            <strong>Total biaya quest </strong>
                            <strong>{formatRupiah(totalCost)}</strong>
                        </div>
                    </div>

                    {error && (
                        <p className="pesanan-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="pesanan-submit"
                    >
                        + Buat Quest
                    </button>
                </form>

                {showSuccessModal && (
                    <div
                        className="pesanan-overlay"
                        role="presentation"
                    >
                        <section
                            className="pesanan-dialog"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="pesanan-success-title"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="pesanan-dialog-icon">
                                ✓
                            </div>

                            <h3 id="pesanan-success-title">
                                Pesanan Berhasil Dibuat!
                            </h3>

                            <p>
                                Quest kamu berhasil dibuat dan sudah
                                ditambahkan ke daftar pesanan.
                            </p>

                            <div className="pesanan-dialog-actions">
                                <button
                                    type="button"
                                    className="pesanan-cancel"
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    OK
                                </button>

                                <button
                                    type="button"
                                    className="pesanan-confirm-delete"
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        onViewOrders?.();
                                    }}
                                >
                                    Lihat Pesanan Anda
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </section>
        );
    }

    return (
        <section className="pesanan-section">
            <div className="pesanan-heading">
                <p>Kelola quest yang sudah kamu buat di sini.</p>
            </div>

            {myQuests.length === 0 ? (
                <div className="pesanan-empty">
                    <span>📋</span>
                    <h3>Belum ada pesanan</h3>
                    <p>Quest yang kamu buat akan muncul di sini.</p>
                </div>
            ) : (
                <div className="pesanan-grid">
                    {myQuests.map((quest) => {
                        const questTip = Number(quest.tip) || 0;
                        const questPay = Number(quest.pay) || 0;
                        const questFoodPrice =
                            Number(quest.foodPrice) || 0;
                        const questDeliveryFee =
                            Number(quest.deliveryFee) ||
                            (Number(quest.distanceKm) || 0) *
                            ONGKIR_PER_KM;

                        const questTotal =
                            quest.totalCost ??
                            questFoodPrice +
                            questPay +
                            questDeliveryFee +
                            questTip;

                        const questReward =
                            quest.partnerReward ??
                            questPay + questTip;

                        const route =
                            quest.location ||
                            `${quest.pickup || '-'}${quest.destination &&
                                quest.destination !== quest.pickup
                                ? ` → ${quest.destination}`
                                : ''
                            }`;

                        const mapUrl =
                            `https://www.google.com/maps/dir/?api=1` +
                            `&origin=${encodeURIComponent(
                                quest.pickup || quest.location || ''
                            )}` +
                            `&destination=${encodeURIComponent(
                                quest.destination || quest.location || ''
                            )}`;

                        return (
                            <article
                                className="pesanan-card"
                                key={quest.id}
                            >
                                <div className="pesanan-card-top">
                                    <span
                                        className={`pesanan-tag ${quest.category}`}
                                    >
                                        {quest.category}
                                    </span>

                                    <span className="pesanan-status">
                                        {quest.status || 'tersedia'}
                                    </span>
                                </div>

                                <h3>{quest.title}</h3>

                                <p className="pesanan-description">
                                    {quest.description ||
                                        'Belum ada deskripsi untuk quest ini.'}
                                </p>

                                {quest.category === 'makanan' && (
                                    <div className="pesanan-info">
                                        <span>Harga makanan</span>
                                        <strong>
                                            {formatRupiah(questFoodPrice)}
                                        </strong>
                                    </div>
                                )}

                                <div className="pesanan-info">
                                    <span>Biaya jasa mitra</span>
                                    <strong>
                                        {formatRupiah(questPay)}
                                    </strong>
                                </div>

                                <div className="pesanan-info">
                                    <span>Ongkos perjalanan</span>
                                    <strong>
                                        {formatRupiah(questDeliveryFee)}
                                    </strong>
                                </div>

                                <div className="pesanan-info">
                                    <span>Tips untuk mitra</span>
                                    <strong>
                                        {formatRupiah(questTip)}
                                    </strong>
                                </div>

                                <div className="pesanan-info">
                                    <span>Imbalan untuk mitra</span>
                                    <strong>
                                        {formatRupiah(questReward)}
                                    </strong>
                                </div>

                                <div className="pesanan-info">
                                    <span>Total biaya quest</span>
                                    <strong>
                                        {formatRupiah(questTotal)}
                                    </strong>
                                </div>

                                <div className="pesanan-location">
                                    <span>📍</span>
                                    <div>
                                        <small>Rute perjalanan</small>
                                        <p>{route}</p>

                                        <a
                                            href={mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Lihat rute di Google Maps ↗
                                        </a>
                                    </div>
                                </div>

                                <div className="pesanan-poster">
                                    <span>Diposting oleh</span>
                                    <strong>
                                        {quest.clientName ||
                                            (quest.clientId === user.id
                                                ? user.name
                                                : 'Pemesan')}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className="pesanan-delete"
                                    onClick={() => setDeleteId(quest.id)}
                                >
                                    🗑 Hapus Quest
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}

            {deleteId !== null && (
                <div
                    className="pesanan-overlay"
                    onClick={() => setDeleteId(null)}
                >
                    <section
                        className="pesanan-dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="pesanan-delete-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="pesanan-dialog-icon">!</div>

                        <h3 id="pesanan-delete-title">
                            Hapus quest ini?
                        </h3>

                        <p>
                            Quest akan dihapus dari daftar pesanan.
                            Tindakan ini tidak bisa dibatalkan.
                        </p>

                        <div className="pesanan-dialog-actions">
                            <button
                                type="button"
                                className="pesanan-cancel"
                                onClick={() => setDeleteId(null)}
                            >
                                Tidak
                            </button>

                            <button
                                type="button"
                                className="pesanan-confirm-delete"
                                onClick={confirmDelete}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}