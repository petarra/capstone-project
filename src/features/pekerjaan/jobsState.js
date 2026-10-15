const VERIFICATION_DELAY = 5000;

export function submitProof(state, payload) {
    const { id, workerId, proof, now } = payload;

    const job = state.quests.find((quest) => quest.id === id);

    if (
        !job ||
        !workerId ||
        job.workerId !== workerId ||
        !['diambil', 'dikerjakan'].includes(job.status)
    ) {
        return state;
    }

    if (!proof?.dataUrl?.startsWith('data:image/jpeg;base64,')) {
        return state;
    }

    return {
        ...state,
        quests: state.quests.map((quest) =>
            quest.id === id
                ? {
                    ...quest,
                    status: 'menunggu_verifikasi',
                    proof,
                    submittedAt: now,
                    verifyAt: now + VERIFICATION_DELAY,
                }
                : quest
        ),
    };
}

export function settleDue(state, now) {
    const menunggu = state.quests.filter(
        (quest) =>
            quest.status === 'menunggu_verifikasi' &&
            Number.isFinite(quest.verifyAt) &&
            quest.verifyAt <= now
    );

    if (menunggu.length === 0) return state;

    const transactions = [...state.transactions];

    for (const quest of menunggu) {
        const sudahDicatat = transactions.some(
            (transaksi) =>
                transaksi.id === `income:${quest.id}` ||
                (transaksi.type === 'income' &&
                    transaksi.questId === quest.id)
        );

        if (!sudahDicatat) {
            transactions.push({
                id: `income:${quest.id}`,
                userId: quest.workerId,
                questId: quest.id,
                type: 'income',
                amount: Number(quest.pay) || 0,
                text: `Penghasilan: ${quest.title}`,
                createdAt: new Date(now).toISOString(),
            });
        }
    }

    const selesaiIds = new Set(
        menunggu.map((quest) => quest.id)
    );

    return {
        ...state,
        transactions,
        quests: state.quests.map((quest) =>
            selesaiIds.has(quest.id)
                ? {
                    ...quest,
                    status: 'selesai',
                    completedAt: now,
                }
                : quest
        ),
    };
}

export function jobsReducer(state, action) {
    switch (action.type) {
        case 'proof':
            return submitProof(state, action.payload);

        case 'settle':
            return settleDue(state, action.now);

        case 'quests':
            return {
                ...state,
                quests:
                    typeof action.value === 'function'
                        ? action.value(state.quests)
                        : action.value,
            };

        case 'transactions':
            return {
                ...state,
                transactions:
                    typeof action.value === 'function'
                        ? action.value(state.transactions)
                        : action.value,
            };

        default:
            return state;
    }
}