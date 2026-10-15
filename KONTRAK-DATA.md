# Kesepakatan data dan integrasi

Data bersama berada di src/context/AppContext.jsx. Gunakan `const { quests, setQuests } = useApp()` (sesuaikan import relatif). Komponen anak menerima data dan handler melalui props. Hindari membuat salinan state quest terpisah pada masing-masing halaman.

- user: id, name, nim, role ('worker' atau 'client'); boleh null setelah logout. Nilai awal profil demo, bukan bukti pengguna sudah login.
- quest: id (string unik), title, category ('kampus', 'antar', 'makanan'), pay (angka rupiah), pickup, destination, status, clientId, workerId. Opsional: note, duration.
- status: tersedia -> diambil -> dikerjakan -> selesai; dibatalkan hanya menurut aturan yang disepakati. Quest baru berstatus tersedia dan workerId null.
- message: id, questId, senderId, text, createdAt (ISO string).
- transaction: id, userId, questId (null untuk top up/penarikan), type ('income', 'topup', 'withdrawal'), amount (positif masuk, negatif keluar), createdAt.
- Saldo pengguna = total amount transaksi milik userId tersebut. Jangan buat saldo terpisah yang bisa berbeda dari transaksi.

## Titik integrasi
1. Anggota 3 menambah quest; anggota 2 menampilkan quest tersedia.
2. Anggota 2 menyediakan tombol/handler onTake pada detail; anggota 4 membuat aksi mengambil dan tampilan pekerjaan. Sepakati ekspor handler melalui context agar bisa dipakai detail. Jangan mengisi tombol dengan dua implementasi berbeda.
3. Anggota 4 menetapkan workerId dan status; anggota 3 menampilkan perubahan status di pesanan pemesan.
4. Anggota 5 memfilter messages berdasarkan questId dan memeriksa pemesan/pekerja terkait dalam simulasi.
5. Anggota 4 dan 6 menyepakati satu fungsi penyelesaian. Satu quest selesai hanya menghasilkan satu transaksi income, jangan menambah penghasilan di dua tempat. Jangan melakukan mutasi atau efek samping di dalam updater state.
6. Jika localStorage dipasang, tentukan satu pemilik implementasi di context. Jangan menyimpan password pengguna nyata dalam browser.

Gunakan pembaruan immutable: setQuests(previous => previous.map(...)). Jangan mengubah array/objek state secara langsung. Perubahan struktur data dan context dibahas lewat PR karena dipakai semua anggota.


Navigasi utama hanya Beranda, Quest, Profil. Fitur dibagi per folder, bukan per jumlah halaman. Chat tampil dalam modal, akun dan dompet di Profil; eksplorasi, pesanan dan pekerjaan di Quest.
