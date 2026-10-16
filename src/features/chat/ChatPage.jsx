import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { demoClient, demoWorkers } from '../../data/dummyData';
import {
    CHAT_KEY,
    canChat,
    isClosed,
    readMessages,
    mergeMessages,
} from './chatUtils';
import './chat.css';

function formatJam(value) {
    return new Date(value).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTanggal(value) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function ChatPage() {
    const { user, quests } = useApp();

    const [messages, setMessages] = useState(readMessages);
    const [selectedId, setSelectedId] = useState('');
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const percakapan = (quests || []).filter((quest) =>
        canChat(quest, user?.id)
    );

    const hasilPencarian = percakapan.filter((quest) =>
        (quest.title || '')
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    const questAktif = percakapan.find(
        (quest) => quest.id === selectedId
    );

    const pesanAktif = questAktif
        ? messages.filter(
            (message) =>
                message.questId === questAktif.id &&
                [
                    questAktif.clientId,
                    questAktif.workerId,
                ].includes(message.senderId)
        )
        : [];

    const chatDitutup = questAktif
        ? isClosed(questAktif)
        : false;

    // Bersihkan pilihan ketika berganti akun.
    useEffect(() => {
        setSelectedId('');
        setDraft('');
        setSearch('');
        setError('');
    }, [user?.id]);

    // Ambil perubahan pesan dari tab browser lain pada origin yang sama.
    useEffect(() => {
        function sinkronkan(event) {
            if (event.key === CHAT_KEY || event.key === null) {
                setMessages(readMessages());
            }
        }

        function bacaUlang() {
            setMessages((sebelumnya) =>
                mergeMessages(sebelumnya, readMessages())
            );
        }

        window.addEventListener('storage', sinkronkan);
        window.addEventListener('focus', bacaUlang);

        return () => {
            window.removeEventListener('storage', sinkronkan);
            window.removeEventListener('focus', bacaUlang);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedId, pesanAktif.length]);

    function namaPengguna(id) {
        if (id === user?.id) {
            return user.name || 'Kamu';
        }

        const akunDemo = [demoClient, ...demoWorkers].find(
            (account) => account.id === id
        );

        if (akunDemo) return akunDemo.name;

        const pesanPengguna = [...messages]
            .reverse()
            .find(
                (message) =>
                    message.senderId === id && message.senderName
            );

        if (pesanPengguna) {
            return pesanPengguna.senderName;
        }

        return id === questAktif?.clientId
            ? 'Pemesan'
            : 'Pekerja';
    }

    function bukaPercakapan(quest) {
        setSelectedId(quest.id);
        setDraft('');
        setError('');
    }

    function kembali() {
        setSelectedId('');
        setDraft('');
        setError('');
    }

    function kirimPesan(event) {
        event.preventDefault();

        const text = draft.trim();

        if (!text || text.length > 2000 || !questAktif) {
            return;
        }

        const questTerbaru = (quests || []).find(
            (quest) => quest.id === questAktif.id
        );

        if (
            !questTerbaru ||
            !canChat(questTerbaru, user?.id) ||
            isClosed(questTerbaru)
        ) {
            setError('Percakapan ini sudah tidak dapat menerima pesan.');
            return;
        }

        const pesanBaru = {
            id:
                globalThis.crypto?.randomUUID?.() ||
                `message-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}`,
            questId: questAktif.id,
            senderId: user.id,
            senderName: user.name || 'Pengguna',
            text,
            createdAt: new Date().toISOString(),
        };

        const hasil = mergeMessages(
            mergeMessages(messages, readMessages()),
            [pesanBaru]
        );

        setMessages(hasil);
        setDraft('');
        setError('');

        try {
            localStorage.setItem(CHAT_KEY, JSON.stringify(hasil));
        } catch {
            setError(
                'Pesan tampil pada sesi ini, tetapi tidak tersimpan karena penyimpanan browser penuh atau tidak tersedia.'
            );
        }

        inputRef.current?.focus();
    }

    if (!user) {
        return (
            <div className="chatf-empty">
                <span>💬</span>
                <h3>Masuk untuk membuka percakapan</h3>
                <p>
                    Percakapan tersedia bagi pemesan dan pekerja
                    yang terhubung pada quest.
                </p>
            </div>
        );
    }

    const lawanBicaraId = questAktif
        ? questAktif.clientId === user.id
            ? questAktif.workerId
            : questAktif.clientId
        : null;

    return (
        <div className="chatf-root">
            <p className="chatf-info">
                Chat prototype lokal. Pesan tersimpan di browser ini,
                belum terhubung antarperangkat.
            </p>

            <div
                className={`chatf-layout ${questAktif ? 'chatf-thread-open' : ''
                    }`}
            >
                {/* Daftar percakapan */}
                <aside className="chatf-sidebar">
                    <div className="chatf-sidebar-header">
                        <h3>Percakapan</h3>
                        <span>{percakapan.length}</span>
                    </div>

                    <label className="chatf-search">
                        <span aria-hidden="true">🔍</span>

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari judul quest..."
                            aria-label="Cari percakapan"
                        />
                    </label>

                    <div className="chatf-thread-list">
                        {percakapan.length === 0 && (
                            <div className="chatf-empty">
                                <h4>Belum ada percakapan</h4>

                                <p>
                                    Ambil quest terlebih dahulu. Chat muncul
                                    setelah quest memiliki pemesan dan pekerja.
                                </p>
                            </div>
                        )}

                        {percakapan.length > 0 &&
                            hasilPencarian.length === 0 && (
                                <p className="chatf-no-result">
                                    Percakapan tidak ditemukan.
                                </p>
                            )}

                        {hasilPencarian.map((quest) => {
                            const riwayat = messages.filter(
                                (message) =>
                                    message.questId === quest.id &&
                                    [
                                        quest.clientId,
                                        quest.workerId,
                                    ].includes(message.senderId)
                            );

                            const terakhir = riwayat[riwayat.length - 1];

                            return (
                                <button
                                    type="button"
                                    key={quest.id}
                                    className={`chatf-thread ${selectedId === quest.id ? 'selected' : ''
                                        }`}
                                    aria-pressed={selectedId === quest.id}
                                    onClick={() => bukaPercakapan(quest)}
                                >
                                    <span
                                        className="chatf-avatar"
                                        aria-hidden="true"
                                    >
                                        {quest.category === 'makanan'
                                            ? '🍱'
                                            : quest.category === 'kampus'
                                                ? '🎓'
                                                : '🛵'}
                                    </span>

                                    <span className="chatf-thread-text">
                                        <strong>{quest.title}</strong>

                                        <small>
                                            {terakhir
                                                ? `${terakhir.senderId === user.id
                                                    ? 'Kamu: '
                                                    : ''
                                                }${terakhir.text}`
                                                : 'Mulai percakapan'}
                                        </small>

                                        <em>
                                            {isClosed(quest) ? 'Arsip' : 'Quest aktif'}
                                        </em>
                                    </span>

                                    {terakhir && (
                                        <time className="chatf-thread-time">
                                            {formatJam(terakhir.createdAt)}
                                        </time>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Isi percakapan */}
                <section
                    className="chatf-conversation"
                    aria-label="Isi percakapan"
                >
                    {!questAktif ? (
                        <div className="chatf-empty chatf-welcome">
                            <span>✉️</span>
                            <h3>Koordinasi lebih mudah</h3>
                            <p>
                                Pilih quest untuk menghubungi pemesan
                                atau pekerjanya.
                            </p>
                        </div>
                    ) : (
                        <>
                            <header className="chatf-header">
                                <button
                                    type="button"
                                    className="chatf-back"
                                    onClick={kembali}
                                    aria-label="Kembali ke daftar percakapan"
                                >
                                    ←
                                </button>

                                <span
                                    className="chatf-avatar"
                                    aria-hidden="true"
                                >
                                    {namaPengguna(lawanBicaraId)
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>

                                <div className="chatf-header-text">
                                    <h3>{namaPengguna(lawanBicaraId)}</h3>
                                    <p>{questAktif.title}</p>
                                </div>

                                <span className="chatf-status">
                                    {chatDitutup ? 'Arsip' : 'Aktif'}
                                </span>
                            </header>

                            <div className="chatf-route">
                                📍 {questAktif.pickup || 'Lokasi ambil'}
                                {' → '}
                                {questAktif.destination || 'Lokasi tujuan'}
                            </div>

                            <div
                                className="chatf-messages"
                                role="log"
                                aria-label="Riwayat pesan"
                                aria-live="polite"
                                aria-relevant="additions text"
                            >
                                {pesanAktif.length === 0 && (
                                    <div className="chatf-empty">
                                        <h4>Belum ada pesan</h4>
                                        <p>
                                            Sapa mitra quest dan koordinasikan
                                            rincian pekerjaan.
                                        </p>
                                    </div>
                                )}

                                {pesanAktif.map((message, index) => {
                                    const milikSaya =
                                        message.senderId === user.id;

                                    const tampilkanTanggal =
                                        index === 0 ||
                                        formatTanggal(
                                            pesanAktif[index - 1].createdAt
                                        ) !== formatTanggal(message.createdAt);

                                    return (
                                        <React.Fragment key={message.id}>
                                            {tampilkanTanggal && (
                                                <div className="chatf-date">
                                                    {formatTanggal(message.createdAt)}
                                                </div>
                                            )}

                                            <div
                                                className={`chatf-message-row ${milikSaya ? 'mine' : ''
                                                    }`}
                                            >
                                                <div className="chatf-bubble">
                                                    <p>{message.text}</p>

                                                    <small>
                                                        <time
                                                            dateTime={message.createdAt}
                                                        >
                                                            {formatJam(message.createdAt)}
                                                        </time>

                                                        {milikSaya && ' · lokal'}
                                                    </small>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}

                                <div ref={bottomRef} />
                            </div>

                            {error && (
                                <p className="chatf-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {chatDitutup ? (
                                <div className="chatf-closed">
                                    Quest sudah berakhir. Riwayat dapat dibaca,
                                    tetapi pengiriman pesan ditutup.
                                </div>
                            ) : (
                                <form
                                    className="chatf-composer"
                                    onSubmit={kirimPesan}
                                >
                                    <label className="chatf-input-wrap">
                                        <span className="chatf-sr-only">
                                            Pesan untuk mitra quest
                                        </span>

                                        <textarea
                                            ref={inputRef}
                                            value={draft}
                                            maxLength={2000}
                                            rows={2}
                                            placeholder="Ketik pesan..."
                                            onChange={(event) =>
                                                setDraft(event.target.value)
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === 'Enter' &&
                                                    !event.shiftKey &&
                                                    !event.nativeEvent.isComposing
                                                ) {
                                                    event.preventDefault();
                                                    kirimPesan(event);
                                                }
                                            }}
                                        />

                                        <small>{draft.length}/2000</small>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={!draft.trim()}
                                    >
                                        Kirim ↗
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}