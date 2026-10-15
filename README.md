# KampusGig — kerangka awal tim 6 orang

Kerangka React + Vite dengan React Router, tema tosca, komponen bersama, dan data contoh. Ini proyek baru yang menjadikan KampusGo sebagai referensi konsep; server.js dan database aplikasi lama tidak digunakan.

## Menjalankan di Windows / VS Code
1. Ekstrak ZIP terlebih dahulu.
2. Buka folder kampusgig-starter (folder yang berisi package.json) di VS Code.
3. Pilih Terminal > New Terminal.
4. Jalankan `npm install`.
5. Jalankan `npm run dev`.
6. Buka alamat Local yang muncul di terminal (biasanya http://localhost:5173).
Jangan membuka index.html dengan double click atau Live Server. Hentikan server dengan Ctrl+C. Gunakan Node.js 22 LTS atau lebih baru.

## Yang sudah dan belum tersedia
Sudah: navigasi tiga halaman, layout responsif, kartu quest statis, props, context dan useState dasar, profil demo, data awal.
Belum: login/daftar, pemilihan peran, pencarian/filter/detail, pembuatan dan pembatalan pesanan, ambil/progres quest, chat, dompet. Tombol kartu dinonaktifkan sengaja. Data hilang saat refresh; localStorage belum dipasang. Tidak ada backend, autentikasi nyata, pembayaran, ataupun komunikasi lintas perangkat.

## Pembagian
| Anggota | Folder | Tugas |
| --- | --- | --- |
| 1 | src/features/akun | Masuk, daftar, profil, peran, logout simulasi |
| 2 | src/features/eksplorasi | Daftar, pencarian, kategori, detail quest |
| 3 | src/features/pesanan | Form buat quest, pesanan saya, pembatalan |
| 4 (kamu) | src/features/pekerjaan | Ambil quest, pekerjaan aktif, progres, riwayat selesai |
| 5 | src/features/chat | Daftar percakapan dan pesan simulasi per quest |
| 6 | src/features/dompet | Saldo, transaksi, top up/penarikan simulasi |

Setiap anggota mengerjakan JSX, CSS, state/interaksi, dan validasi untuk fiturnya. File CSS fitur sudah disiapkan; import di halaman masing-masing ketika mulai digunakan. Beranda memakai komponen bersama. Kerangka tidak menggantikan kontribusi fitur setiap anggota.

Baca KONTRAK-DATA.md sebelum mengubah data bersama dan PANDUAN-TIM.md untuk Git.

## Build dan deployment
`npm run build` menghasilkan dist. `npm run preview` menguji hasil build secara lokal.
Vercel: framework Vite, build npm run build, output dist. Netlify: build npm run build, publish dist. Fallback React Router sudah disediakan. Untuk GitHub Pages perlu konfigurasi base dan routing tambahan.

## Versi perbaikan
Konfigurasi JSX otomatis sudah disediakan di vite.config.js. Semua komponen juga mengimpor React secara eksplisit. Ekstrak ke folder baru agar tidak bercampur dengan percobaan perubahan sebelumnya. Jalankan npm install, kemudian npm run dev.

## Versi 3 navigasi sesuai aplikasi contoh
Navigasi utama hanya Beranda (/), Quest (/quest), Profil (/profil). Tampilan berupa bingkai aplikasi maksimal 440px seperti contoh: penuh pada mobile, di tengah pada tablet/desktop, dengan navigasi bawah tetap. Bukan layout desktop yang melebar.

- Beranda: header profil, pencarian nonaktif, saldo contoh, jadwal contoh, banner, kategori, kartu quest.
- Quest: subtab eksplorasi/dikerjakan bagi pekerja; buat pesanan/pesanan Anda bagi pemesan. Pilihan peran dan subtab hanya navigasi preview; fitur bisnis belum dibuat. Chat adalah modal di dalam Quest.
- Profil: akun dan dompet berada dalam satu halaman.

Pembagian folder untuk enam orang tetap berlaku. Anggota 1 mengisi fitur akun di Profil (login dapat berupa panel/modal tanpa menambah halaman utama), anggota 2 eksplorasi di Quest, anggota 3 pesanan di Quest, anggota 4 pekerjaan di Quest, anggota 5 modal chat, anggota 6 dompet di Profil. Jangan menambah menu utama baru. Saat mengintegrasikan akun, hubungkan preview role pada Quest dengan user.role.

Gambar banner dan avatar diambil dari aplikasi contoh yang diunggah. Status Online, saldo, dan jadwal masih contoh statis. Tidak ada fungsi pengambilan, chat, atau transaksi aktif.
