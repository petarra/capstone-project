export const CHAT_KEY = 'kampusgig-chat-v1';

export function canChat(quest, userId) {
    if (!userId || !quest || !quest.clientId) return false;
    const workerId = quest.workerId || quest.requestedWorkerId;
    if (!workerId) return false;
    return quest.clientId === userId || workerId === userId;
}

export function isClosed(quest) {
    return ['selesai', 'dibatalkan', 'ditolak'].includes(
        quest.status
    );
}

export function readMessages() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(CHAT_KEY) || '[]'
        );

        if (!Array.isArray(saved)) return [];

        return saved.filter(
            (message) =>
                message &&
                typeof message.id === 'string' &&
                typeof message.questId === 'string' &&
                typeof message.senderId === 'string' &&
                typeof message.text === 'string' &&
                message.text.trim() &&
                message.text.length <= 2000 &&
                Number.isFinite(Date.parse(message.createdAt))
        );
    } catch {
        return [];
    }
}

export function mergeMessages(first, second) {
    const unique = new Map();

    [...first, ...second].forEach((message) => {
        unique.set(message.id, message);
    });

    return [...unique.values()].sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
    );
}