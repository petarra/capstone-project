import React, { useEffect, useRef, useState } from 'react';

async function siapkanFoto(file) {
    if (
        !file.type.startsWith('image/') ||
        file.type === 'image/svg+xml'
    ) {
        throw new Error('Pilih file foto JPG, PNG, atau WebP.');
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran foto maksimal 5 MB.');
    }

    const url = URL.createObjectURL(file);

    try {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve(img);
            img.onerror = () =>
                reject(
                    new Error('Foto tidak bisa dibaca. Coba JPG atau PNG.')
                );

            img.src = url;
        });

        // Perkecil foto supaya tidak cepat memenuhi penyimpanan browser.
        const skala = Math.min(
            1,
            960 / Math.max(image.width, image.height)
        );

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * skala));
        canvas.height = Math.max(1, Math.round(image.height * skala));

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Browser tidak bisa memproses foto.');
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        if (dataUrl.length > 800000) {
            throw new Error('Foto masih terlalu besar. Pilih foto lain.');
        }

        return {
            name: file.name || 'foto-bukti.jpg',
            type: 'image/jpeg',
            dataUrl,
        };
    } finally {
        URL.revokeObjectURL(url);
    }
}

export default function BuktiModal({ job, onClose, onSubmit }) {
    const [foto, setFoto] = useState(null);
    const [error, setError] = useState('');
    const [memproses, setMemproses] = useState(false);
    const [mengirim, setMengirim] = useState(false);

    const panelRef = useRef(null);
    const prosesRef = useRef(0);
    const sudahKirimRef = useRef(false);

    useEffect(() => {
        const fokusSebelumnya = document.activeElement;
        const overflowSebelumnya = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        return () => {
            prosesRef.current += 1;
            document.body.style.overflow = overflowSebelumnya;
            fokusSebelumnya?.focus();
        };
    }, []);

    async function pilihFoto(event) {
        const file = event.target.files?.[0];

        // Memungkinkan memilih ulang file yang sama.
        event.target.value = '';

        if (!file) return;

        const nomorProses = ++prosesRef.current;

        setFoto(null);
        setError('');
        setMemproses(true);

        try {
            const hasil = await siapkanFoto(file);

            if (nomorProses === prosesRef.current) {
                setFoto(hasil);
            }
        } catch (err) {
            if (nomorProses === prosesRef.current) {
                setError(err.message);
            }
        } finally {
            if (nomorProses === prosesRef.current) {
                setMemproses(false);
            }
        }
    }

    function kirim(event) {
        event.preventDefault();

        if (!foto || memproses || sudahKirimRef.current) return;

        sudahKirimRef.current = true;
        setMengirim(true);
        onSubmit(foto);
    }

    function handleKeyboard(event) {
        if (event.key === 'Escape' && !mengirim) {
            onClose();
        }

        // Jaga fokus keyboard tetap di dalam dialog.
        if (event.key !== 'Tab') return;

        const elements = [
            ...panelRef.current.querySelectorAll(
                'button:not(:disabled), input:not(:disabled)'
            ),
        ];

        const pertama = elements[0];
        const terakhir = elements[elements.length - 1];

        if (!pertama) {
            event.preventDefault();
            return;
        }

        if (
            event.shiftKey &&
            (document.activeElement === pertama ||
                document.activeElement === panelRef.current)
        ) {
            event.preventDefault();
            terakhir.focus();
        } else if (
            !event.shiftKey &&
            (document.activeElement === terakhir ||
                document.activeElement === panelRef.current)
        ) {
            event.preventDefault();
            pertama.focus();
        }
    }

    return (
        <div
            className="pekerjaan-overlay"
            onClick={() => !mengirim && onClose()}
        >
            <section
                ref={panelRef}
                tabIndex={-1}
                className="pekerjaan-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="judul-bukti"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={handleKeyboard}
            >
                <div className="pekerjaan-modal-head">
                    <span className="pekerjaan-kicker">
                        BUKTI PENYELESAIAN
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={mengirim}
                        aria-label="Tutup pop-up"
                    >
                        ✕
                    </button>
                </div>

                <h2 id="judul-bukti">Satu foto, quest beres.</h2>
                <p>
                    Tambahkan foto bukti untuk <b>{job.title}</b>.
                </p>

                <form onSubmit={kirim}>
                    <div className="pekerjaan-upload-options">
                        <label>
                            🖼️ Pilih dari Galeri
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={pilihFoto}
                                disabled={memproses || mengirim}
                            />
                        </label>

                        <label>
                            📷 Ambil Foto
                            <input
                                type="file"
                                accept="image/*"
                                capture="user"
                                onChange={pilihFoto}
                                disabled={memproses || mengirim}
                            />
                        </label>
                    </div>

                    <p className="pekerjaan-help">
                        Maksimal 5 MB. Kamera mengikuti dukungan perangkat.
                        Gunakan galeri jika kamera tidak tersedia.
                    </p>

                    {memproses && (
                        <p role="status">Menyiapkan foto...</p>
                    )}

                    {error && (
                        <p className="pekerjaan-error" role="alert">
                            {error}
                        </p>
                    )}

                    {foto ? (
                        <div className="pekerjaan-preview">
                            <img
                                src={foto.dataUrl}
                                alt="Preview bukti penyelesaian"
                            />

                            <span>{foto.name}</span>

                            <button
                                type="button"
                                disabled={mengirim}
                                onClick={() => setFoto(null)}
                            >
                                Hapus foto
                            </button>
                        </div>
                    ) : (
                        <div className="pekerjaan-photo-empty">
                            Foto bukti belum dipilih
                        </div>
                    )}

                    <div className="pekerjaan-modal-actions">
                        <button
                            type="button"
                            className="pekerjaan-secondary"
                            disabled={mengirim}
                            onClick={onClose}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="pekerjaan-primary"
                            disabled={!foto || memproses || mengirim}
                        >
                            {mengirim ? 'Mengirim...' : 'Kirim Bukti'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}