// Data contoh, bukan pesanan pengguna sungguhan. Jangan simpan password di sini.
export const demoUser = { id: 'user-demo', name: 'Mahasiswa UNTAN', nim: 'NIM contoh', role: 'worker' };
export const initialQuests = [
 { id: 'q1', title: 'Antar makan siang ke Teknik', category: 'makanan', pay: 10000, pickup: 'Kantin UNTAN', destination: 'Fakultas Teknik', status: 'tersedia', clientId: 'client-demo', workerId: null },
 { id: 'q2', title: 'Ambil berkas di fotokopi', category: 'antar', pay: 15000, pickup: 'Fotokopi FKIP', destination: 'Perpustakaan UNTAN', status: 'tersedia', clientId: 'client-demo', workerId: null },
 { id: 'q3', title: 'Bantu persiapan acara kampus', category: 'kampus', pay: 35000, pickup: 'Sekretariat panitia', destination: 'Auditorium UNTAN', status: 'tersedia', clientId: 'client-demo', workerId: null },
];
export const questStatuses = ['tersedia', 'diambil', 'dikerjakan', 'selesai', 'dibatalkan'];
