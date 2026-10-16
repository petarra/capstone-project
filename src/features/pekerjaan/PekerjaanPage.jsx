import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './pekerjaan.css';

const statusLabels = {
  diambil: 'Siap dikerjakan',
  dikerjakan: 'Sedang dikerjakan',
};

export default function PekerjaanPage({ onOpenChat }) {
  const { user, quests, setQuests, setNotifications, setTransactions } = useApp();
  const proofInputRef = useRef(null);
  const [proofQuestId, setProofQuestId] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [proofError, setProofError] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const invitations = quests.filter(
    (quest) => quest.status === 'menunggu-konfirmasi' && quest.requestedWorkerId === user.id,
  );
  const activeJobs = quests.filter(
    (quest) => quest.workerId === user.id && ['diambil', 'dikerjakan'].includes(quest.status),
  );

  useEffect(() => {
    if (!proofFile) {
      setProofPreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(proofFile);
    setProofPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [proofFile]);

  const acceptInvitation = (questId) => {
    setQuests((current) => current.map((quest) => (
      quest.id === questId
        && quest.status === 'menunggu-konfirmasi'
        && quest.requestedWorkerId === user.id
        ? { ...quest, status: 'diambil', workerId: user.id, requestedWorkerId: null, acceptedAt: new Date().toISOString() }
        : quest
    )));
  };

  const declineInvitation = (questId) => {
    const declinedAt = new Date().toISOString();
    const invitation = quests.find(
      (quest) => quest.id === questId
        && quest.status === 'menunggu-konfirmasi'
        && quest.requestedWorkerId === user.id,
    );
    if (!invitation) return;

    setQuests((current) => current.map((quest) => (
      quest.id === questId && quest.status === 'menunggu-konfirmasi'
        ? {
          ...quest,
          status: 'ditolak',
          requestedWorkerId: null,
          declinedWorkerId: user.id,
          declinedAt,
        }
        : quest
    )));
    setNotifications((current) => [{
      id: `notification-${Date.now()}`,
      recipientId: invitation.clientId,
      questId,
      type: 'worker_declined',
      read: false,
      message: `${user.name} menolak permintaan "${invitation.title}". Kamu dapat menjadikannya misi publik.`,
    }, ...current]);
  };

  const cancelJob = (questId) => {
    if (!quests.some((quest) => (
      quest.id === questId && quest.workerId === user.id
        && ['diambil', 'dikerjakan'].includes(quest.status)
    ))) return;
    setQuests((current) => current.map((quest) => (
      quest.id === questId && quest.workerId === user.id
        && ['diambil', 'dikerjakan'].includes(quest.status)
        ? {
          ...quest,
          status: 'tersedia',
          visibility: 'public',
          workerId: null,
          requestedWorkerId: null,
          cancelledAt: new Date().toISOString(),
        }
        : quest
    )));
    if (proofQuestId === questId) {
      setProofQuestId(null);
      setProofFile(null);
      setProofError('');
    }
  };

  const startCompletion = (questId) => {
    setProofQuestId(questId);
    setProofFile(null);
    setProofError('');
    proofInputRef.current?.click();
  };

  const selectProof = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProofError('Pilih file foto sebagai bukti penyelesaian.');
      setProofFile(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setProofError('Ukuran foto maksimal 8 MB.');
      setProofFile(null);
      return;
    }
    setProofError('');
    setProofFile(file);
  };

  const readProofFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Hasil foto tidak dapat dibaca.'));
    };
    reader.onerror = () => reject(reader.error || new Error('Foto bukti gagal dibaca.'));
    reader.readAsDataURL(file);
  });

  const submitCompletion = async (questId) => {
    if (!proofFile || submittingProof) return;
    const currentQuest = quests.find((quest) => (
      quest.id === questId && quest.workerId === user.id
        && ['diambil', 'dikerjakan'].includes(quest.status)
    ));
    if (!currentQuest) {
      setProofError('Pekerjaan ini sudah tidak aktif. Muat ulang daftar pekerjaan.');
      return;
    }

    setSubmittingProof(true);
    setProofError('');
    try {
      const proofDataUrl = await readProofFile(proofFile);
      const completedAt = new Date().toISOString();
      setQuests((current) => current.map((quest) => (
        quest.id === questId && quest.workerId === user.id
          && ['diambil', 'dikerjakan'].includes(quest.status)
          ? {
            ...quest,
            status: 'selesai',
            completionProof: {
              dataUrl: proofDataUrl,
              name: proofFile.name,
              type: proofFile.type,
              submittedAt: completedAt,
            },
            completedAt,
          }
          : quest
      )));
      setNotifications((current) => [{
        id: `notification-${Date.now()}`,
        recipientId: currentQuest.clientId,
        questId,
        type: 'quest_completed',
        read: false,
        message: `${user.name} menyelesaikan "${currentQuest.title}" dan mengirim foto bukti.`,
      }, ...current]);
      if (setTransactions) {
        const reward = Number(currentQuest.partnerReward ?? currentQuest.pay ?? 0);
        setTransactions((prev) => [
          {
            id: `income-${questId}-${Date.now()}`,
            userId: user.id,
            questId,
            type: 'income',
            amount: reward,
            createdAt: completedAt,
          },
          ...prev,
        ]);
      }
      setProofQuestId(null);
      setProofFile(null);
    } catch (error) {
      setProofError(error instanceof Error ? error.message : 'Foto bukti gagal diproses. Silakan coba lagi.');
    } finally {
      setSubmittingProof(false);
    }
  };

  return (
    <div className="pekerjaan-page">
      <section className="pekerjaan-section">
        <div className="pekerjaan-heading">
          <div>
            <span className="pekerjaan-eyebrow">PERMINTAAN LANGSUNG</span>
            <h3>Undangan pekerjaan</h3>
            <p>Permintaan ini hanya dapat diterima atau ditolak oleh kamu.</p>
          </div>
          <span className="pekerjaan-count">{invitations.length}</span>
        </div>

        {invitations.length === 0 ? (
          <div className="pekerjaan-empty">
            <span aria-hidden="true">📨</span>
            <div>
              <h4>Belum ada undangan</h4>
              <p>Jika pemesan memilih namamu, permintaannya akan muncul di sini.</p>
            </div>
          </div>
        ) : (
          <div className="pekerjaan-list">
            {invitations.map((quest) => (
              <article className="pekerjaan-invitation" key={quest.id}>
                <div className="pekerjaan-card-heading">
                  <div>
                    <span className="quest-status quest-status-menunggu-konfirmasi">Undangan khusus</span>
                    <h4>{quest.title}</h4>
                  </div>
                  <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(quest.pay)}</strong>
                </div>
                <p>{quest.description}</p>
                <small>📍 {quest.pickup} → {quest.destination}</small>
                <div className="pekerjaan-actions">
                  <button className="button" type="button" onClick={() => acceptInvitation(quest.id)}>Terima undangan</button>
                  <button className="button outline-btn pekerjaan-chat-btn" type="button" onClick={() => onOpenChat?.(quest.id)}>💬 Chat Pemesan</button>
                  <button className="button outline-btn" type="button" onClick={() => declineInvitation(quest.id)}>Tolak</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <input
        ref={proofInputRef}
        className="pekerjaan-proof-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={selectProof}
        aria-label="Ambil atau pilih foto bukti pekerjaan"
      />

      <section className="pekerjaan-section">
        <div className="pekerjaan-heading">
          <div>
            <span className="pekerjaan-eyebrow">AKTIVITAS SAYA</span>
            <h3>Pekerjaan aktif</h3>
            <p>Pekerjaan yang kamu terima akan hilang dari daftar publik.</p>
          </div>
          <span className="pekerjaan-count">{activeJobs.length}</span>
        </div>

        {activeJobs.length === 0 ? (
          <div className="pekerjaan-empty">
            <span aria-hidden="true">🛵</span>
            <div>
              <h4>Belum ada pekerjaan aktif</h4>
              <p>Ambil pekerjaan publik dari tab Eksplorasi untuk memulai.</p>
            </div>
          </div>
        ) : (
          <div className="pekerjaan-list">
            {activeJobs.map((quest) => (
              <article className="pekerjaan-active-card" key={quest.id}>
                <div className="pekerjaan-card-heading">
                  <div>
                    <span className="quest-status quest-status-diambil">{statusLabels[quest.status] || quest.status}</span>
                    <h4>{quest.title}</h4>
                  </div>
                  <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(quest.pay)}</strong>
                </div>
                <p>{quest.description}</p>
                <small>📍 {quest.pickup} → {quest.destination}</small>
                {proofQuestId === quest.id ? (
                  <div className="pekerjaan-proof-panel">
                    <div>
                      <h5>Foto bukti penyelesaian</h5>
                      <p>Ambil foto dengan kamera atau pilih gambar dari perangkatmu. Tinjau foto sebelum mengirim.</p>
                    </div>
                    {proofPreview && (
                      <img className="pekerjaan-proof-preview" src={proofPreview} alt={`Pratinjau bukti ${quest.title}`} />
                    )}
                    {proofFile && <p className="pekerjaan-proof-filename">Foto dipilih: {proofFile.name}</p>}
                    {proofError && <p className="pekerjaan-proof-error" role="alert">{proofError}</p>}
                    <div className="pekerjaan-actions">
                      <button
                        className="button outline-btn"
                        type="button"
                        onClick={() => proofInputRef.current?.click()}
                      >
                        {proofFile ? 'Ambil ulang foto' : 'Buka kamera / pilih foto'}
                      </button>
                      <button
                        className="button"
                        type="button"
                        disabled={!proofFile || submittingProof}
                        onClick={() => submitCompletion(quest.id)}
                      >
                        {submittingProof ? 'Mengirim bukti...' : 'Kirim bukti & selesaikan'}
                      </button>
                      <button
                        className="button outline-btn"
                        type="button"
                        disabled={submittingProof}
                        onClick={() => {
                          setProofQuestId(null);
                          setProofFile(null);
                          setProofError('');
                        }}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pekerjaan-actions">
                    <button className="button" type="button" onClick={() => startCompletion(quest.id)}>
                      Selesaikan quest
                    </button>
                    <button
                      className="button outline-btn pekerjaan-chat-btn"
                      type="button"
                      onClick={() => onOpenChat?.(quest.id)}
                    >
                      💬 Chat Pemesan
                    </button>
                    <button className="button outline-btn pekerjaan-cancel" type="button" onClick={() => cancelJob(quest.id)}>
                      Batalkan pekerjaan
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
