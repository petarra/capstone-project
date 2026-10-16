// Data contoh, bukan pesanan pengguna sungguhan. Jangan simpan password di sini.
export const demoWorkers = [
  { id: 'user-demo', name: 'Mahasiswa UNTAN', nim: 'NIM contoh', role: 'worker' },
  { id: 'worker-andi', name: 'Andi Pratama', nim: 'NIM contoh', role: 'worker' },
  { id: 'worker-siti', name: 'Siti Rahma', nim: 'NIM contoh', role: 'worker' },
];
export const demoUser = demoWorkers[0];
export const demoClient = { id: 'client-demo', name: 'Pemesan Demo', role: 'client' };
export const initialQuests = [
 { id: 'q1', title: 'Antar makan siang ke Teknik', category: 'makanan', jobType: 'antar-jemput', clientType: 'mahasiswa', description: 'Tolong ambil pesanan makan di kantin dan antar ke lobi Fakultas Teknik.', pay: 10000, scheduledAt: '2026-10-16T12:00:00', pickup: 'Kantin UNTAN', destination: 'Fakultas Teknik', status: 'tersedia', visibility: 'public', clientId: 'client-demo', workerId: null, requestedWorkerId: null },
 { id: 'q2', title: 'Ambil berkas di fotokopi', category: 'antar', jobType: 'sekitar-kampus', clientType: 'dosen', description: 'Ambil dua bundel berkas yang sudah dicetak, lalu antar ke ruang dosen FKIP.', pay: 15000, scheduledAt: '2026-10-16T09:30:00', pickup: 'Fotokopi FKIP', destination: 'Ruang dosen FKIP', status: 'tersedia', visibility: 'public', clientId: 'client-demo', workerId: null, requestedWorkerId: null },
 { id: 'q3', title: 'Bantu persiapan acara kampus', category: 'kampus', jobType: 'sekitar-kampus', clientType: 'staff', description: 'Bantu menata kursi dan perlengkapan sebelum acara dimulai di auditorium.', pay: 35000, scheduledAt: '2026-10-17T07:00:00', pickup: 'Sekretariat panitia', destination: 'Auditorium UNTAN', status: 'tersedia', visibility: 'public', clientId: 'client-demo', workerId: null, requestedWorkerId: null },
];
export const questStatuses = ['tersedia', 'menunggu-konfirmasi', 'diambil', 'dikerjakan', 'selesai', 'ditolak', 'dibatalkan'];
