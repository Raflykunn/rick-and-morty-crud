# Rick and Morty - Manajemen Karakter

Aplikasi web sederhana untuk melihat dan mengelola data karakter dari semesta Rick and Morty. Data awal diambil langsung dari Rick and Morty API, kemudian disimpan ke database lokal SQLite agar bisa ditambah, diubah, maupun dihapus secara bebas.

Tampilan antarmuka dibuat bersih, simpel, dan langsung ke fungsi intinya tanpa styling berlebihan.

---

## Fitur

- **Daftar Karakter**: Menampilkan foto, nama, status, spesies, dan gender.
- **Pencarian & Filter**: Cari karakter lewat nama atau spesies, serta filter status (Alive, Dead, unknown).
- **Tambah Karakter**: Form input untuk memasukkan karakter baru ke database.
- **Edit Karakter**: Form ubah data karakter yang sudah tersimpan.
- **Hapus Karakter**: Hapus karakter dari database dengan konfirmasi.
- **Penyimpanan Lokal**: Database SQLite tersimpan di file `server/database.sqlite`.
- **Pengujian Otomatis**: Dilengkapi unit test untuk memastikan endpoint REST API berfungsi dengan benar.

---

## Cara Menjalankan

Pastikan sudah terpasang **Node.js** di komputer.

### 1. Pasang dependensi
```bash
npm install
```

### 2. Jalankan aplikasi

**Pilihan 1: Mode Siap Pakai (Rekomendasi)**
```bash
npm start
```
Buka browser dan kunjungi: **http://localhost:5000**

**Pilihan 2: Mode Development (Live Reload)**
```bash
npm run dev
```
Buka browser di: **http://localhost:5173** (frontend) dan **http://localhost:5000** (backend API).

---

## Menjalankan Unit Test

Untuk menjalankan pengetesan endpoint API:
```bash
npm test
```

Semua pengujian (GET, POST validasi, PUT, DELETE, dan penanganan 404) akan dijalankan secara otomatis lewat test runner bawaan Node.js.

---

## Struktur Folder

```text
simple-crud-react/
├── package.json
├── vite.config.js
├── README.md
├── index.html
├── server/
│   ├── index.js          # Entry point server
│   ├── app.js            # Router REST API
│   ├── db.js             # Koneksi SQLite & inisialisasi data
│   └── database.sqlite   # File database lokal
├── src/
│   ├── main.jsx          # Entry point React
│   ├── App.jsx           # Komponen utama
│   ├── App.css           # Styling dasar
│   └── components/
│       ├── CharacterForm.jsx   # Form input data
│       └── CharacterTable.jsx  # Tabel daftar karakter
└── test/
    └── api.test.js       # File unit test
```
