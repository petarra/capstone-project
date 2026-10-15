# Mulai kerja kelompok

## Persiapan oleh satu anggota
Buat repository GitHub kosong. Di terminal folder proyek:

```bash
git init
git add .
git commit -m "chore: siapkan kerangka awal KampusGig"
git branch -M main
git remote add origin URL_REPOSITORY_KELOMPOK
git push -u origin main
```

Ganti URL_REPOSITORY_KELOMPOK dengan URL GitHub tim. Initial commit ini untuk repository kosong saja. Setelah baseline, semua pengembangan fitur melalui branch dan Pull Request. Tambahkan lima teman sebagai collaborator, dan aktifkan branch protection main jika tersedia.

## Setiap anggota
Clone repository tim, bukan membuat repository masing-masing:

```bash
git clone URL_REPOSITORY_KELOMPOK
cd NAMA_FOLDER_REPOSITORY
npm install
git switch -c fitur/pekerjaan
npm run dev
```

Ganti nama folder dan branch sesuai tugas: fitur/akun, fitur/eksplorasi, fitur/pesanan, fitur/pekerjaan, fitur/chat, fitur/dompet.
Setelah mengerjakan bagianmu:

```bash
npm run build
git add .
git commit -m "feat: tambahkan daftar pekerjaan aktif"
git push -u origin fitur/pekerjaan
```

Buat Pull Request di GitHub dari branch tersebut ke main. Minta teman memeriksa perubahan, lalu merge. Jangan force push ke main.
Sebelum branch berikutnya: git switch main, git pull origin main, lalu buat branch baru. Jangan berpindah branch jika ada perubahan belum disimpan/di-commit.

## Urutan integrasi yang disarankan
1. Sepakati kontrak data dan desain bersama.
2. Semua mengerjakan UI dan logika dengan data contoh dalam folder sendiri.
3. Gabungkan akun, eksplorasi, dan pesanan, lalu pengambilan, chat, dan dompet secara bertahap.
4. Uji bersama: buat quest -> cari -> ambil -> chat -> ubah progres -> selesai -> pendapatan masuk satu kali.
5. Coba ukuran mobile dan desktop, periksa console, jalankan build, deploy, lalu tes tautan halaman langsung.

Anggota 4 tetap bisa membuat daftar pekerjaan dengan data percobaan sebelum anggota 3 selesai. Anggota 6 juga bisa memakai transaksi contoh. Data percobaan harus dihapus/dikembalikan sebelum merge final. File App.jsx, context, dan CSS global hanya diubah setelah koordinasi. CSS fitur gunakan awalan nama fitur.


Navigasi utama hanya Beranda, Quest, Profil. Fitur dibagi per folder, bukan per jumlah halaman. Chat tampil dalam modal, akun dan dompet di Profil; eksplorasi, pesanan dan pekerjaan di Quest.
