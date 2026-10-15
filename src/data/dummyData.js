// Data contoh, bukan pesanan pengguna sungguhan. Jangan simpan password di sini.
export const demoUser = { id: 'user-demo', name: 'Mahasiswa UNTAN', nim: 'NIM contoh', role: 'worker' };
export const initialQuests = [
 { id: 'q1', title: 'Antar makan siang ke Teknik', category: 'makanan', jobType: 'antar-jemput', clientType: 'mahasiswa', description: 'Tolong ambil pesanan makan di kantin dan antar ke lobi Fakultas Teknik.', pay: 10000, scheduledAt: '2026-10-16T12:00:00', pickup: 'Kantin UNTAN', destination: 'Fakultas Teknik', status: 'tersedia', clientId: 'client-demo', workerId: null },
 { id: 'q2', title: 'Ambil berkas di fotokopi', category: 'antar', jobType: 'sekitar-kampus', clientType: 'dosen', description: 'Ambil dua bundel berkas yang sudah dicetak, lalu antar ke ruang dosen FKIP.', pay: 15000, scheduledAt: '2026-10-16T09:30:00', pickup: 'Fotokopi FKIP', destination: 'Ruang dosen FKIP', status: 'tersedia', clientId: 'client-demo', workerId: null },
 { id: 'q3', title: 'Bantu persiapan acara kampus', category: 'kampus', jobType: 'sekitar-kampus', clientType: 'staff', description: 'Bantu menata kursi dan perlengkapan sebelum acara dimulai di auditorium.', pay: 35000, scheduledAt: '2026-10-17T07:00:00', pickup: 'Sekretariat panitia', destination: 'Auditorium UNTAN', status: 'tersedia', clientId: 'client-demo', workerId: null },
];
export const questStatuses = ['tersedia', 'diambil', 'dikerjakan', 'selesai', 'dibatalkan'];
