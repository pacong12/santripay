# Dokumentasi Santri Pay

## 1. Gambaran Umum
Santri Pay adalah sistem pembayaran digital untuk pesantren yang memungkinkan santri mengelola pembayaran iuran (misalnya, bulanan, kegiatan, atau buku) melalui Progressive Web App (PWA) di perangkat Android, serta admin mengelola data santri, tagihan, dan transaksi melalui antarmuka web. Sistem ini dirancang untuk meningkatkan efisiensi pengelolaan keuangan pesantren, dengan fokus pada kemudahan penggunaan, keamanan, dan skalabilitas.

### 1.1 Tujuan
- Efisiensi Keuangan: Mengotomatisasi proses pembayaran dan pelacakan tagihan.
- Aksesibilitas: Memberikan akses mudah bagi santri melalui PWA yang mendukung mode offline.
- Manajemen Terpusat: Memungkinkan admin mengelola data santri, tagihan, dan transaksi dalam satu platform.
- Transparansi: Menyediakan laporan keuangan dan riwayat transaksi yang jelas.
- Skalabilitas: Mendukung pesantren dengan jumlah santri yang bervariasi, dari puluhan hingga ribuan.

### 1.2 Pengguna

#### Santri:
- Mengakses sistem melalui PWA di perangkat Android.
- Fitur: Login, melihat saldo, riwayat transaksi, mengajukan pembayaran, menerima notifikasi.

#### Admin:
- Mengakses sistem melalui web di desktop/laptop.
- Fitur: Login, manajemen santri, kelas, tagihan, transaksi, laporan, dan pengaturan sistem.

### 1.3 Lingkungan Penggunaan
- Santri: Perangkat Android (smartphone/tablet) dengan browser modern (Chrome, Firefox).
- Admin: Browser desktop (Chrome, Firefox, Edge) dengan koneksi internet stabil.
- Server: Cloud (Vercel untuk frontend, Render/Heroku untuk backend) atau server lokal pesantren.

## 2. Struktur Database
Sistem menggunakan database relasional (disarankan PostgreSQL untuk produksi, SQLite untuk pengembangan) dengan tabel berikut. Setiap tabel memiliki kolom wajib untuk audit (created_at, updated_at) dan menggunakan UUID sebagai primary key untuk skalabilitas.

### 2.1 Tabel

#### Users

Deskripsi: Menyimpan data autentikasi pengguna (admin dan santri).
Kolom:
id (UUID, primary key)
username (varchar(50), unik)
password (varchar(255), terenkripsi dengan bcrypt)
role (enum: "admin", "santri")
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: 1:1 dengan santri (untuk role santri).
Contoh Data:id: "550e8400-e29b-41d4-a716-446655440000"
username: "admin1"
password: "$2b$10$..."
role: "admin"
created_at: "2025-06-11T11:00:00Z"
updated_at: "2025-06-11T11:00:00Z"

#### Santri

Deskripsi: Menyimpan profil santri.
Kolom:
id (UUID, primary key)
user_id (UUID, foreign key ke users, unik)
name (varchar(100))
santri_id (varchar(20), unik, misalnya "S12345")
kelas_id (UUID, foreign key ke kelas)
balance (bigint, default: 0, saldo dalam Rupiah)
phone (varchar(15), opsional)
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: 1:N dengan tagihan, transaksi; N:1 dengan kelas, users.
Contoh Data:id: "123e4567-e89b-12d3-a456-426614174000"
user_id: "550e8400-e29b-41d4-a716-446655440001"
name: "Ahmad Fauzi"
santri_id: "S12345"
kelas_id: "789e1234-e89b-12d3-a456-426614174000"
balance: 500000
phone: "081234567890"
created_at: "2025-06-11T11:00:00Z"
updated_at: "2025-06-11T11:00:00Z"

#### Kelas

Deskripsi: Menyimpan data kelas di pesantren (misalnya, 1A, Tsanawiyah).
Kolom:
id (UUID, primary key)
name (varchar(50), misalnya "1A")
level (varchar(50), opsional, misalnya "Tsanawiyah")
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: 1:N dengan santri.
Contoh Data:id: "789e1234-e89b-12d3-a456-426614174000"
name: "1A"
level: "Tsanawiyah"
created_at: "2025-06-11T11:00:00Z"
updated_at: "2025-06-11T11:00:00Z"

#### Tagihan

Deskripsi: Menyimpan data tagihan untuk santri.
Kolom:
id (UUID, primary key)
santri_id (UUID, foreign key ke santri)
jenis_tagihan_id (UUID, foreign key ke jenis_tagihan)
amount (bigint, dalam Rupiah)
due_date (date)
status (enum: "pending", "paid", "overdue")
description (text, opsional)
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: N:1 dengan santri, jenis_tagihan; 1:1 dengan transaksi (opsional).
Contoh Data:id: "456e7890-e89b-12d3-a456-426614174000"
santri_id: "123e4567-e89b-12d3-a456-426614174000"
jenis_tagihan_id: "890e1234-e89b-12d3-a456-426614174000"
amount: 100000
due_date: "2025-07-01"
status: "pending"
description: "Iuran bulanan Juli"
created_at: "2025-06-11T11:00:00Z"
updated_at: "2025-06-11T11:00:00Z"

#### Transaksi

Deskripsi: Menyimpan riwayat pembayaran santri.
Kolom:
id (UUID, primary key)
santri_id (UUID, foreign key ke santri)
tagihan_id (UUID, foreign key ke tagihan, nullable)
amount (bigint, dalam Rupiah)
status (enum: "pending", "approved", "rejected")
payment_date (timestamp)
note (text, opsional, misalnya alasan penolakan)
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: N:1 dengan santri, tagihan.
Contoh Data:id: "678e9012-e89b-12d3-a456-426614174000"
santri_id: "123e4567-e89b-12d3-a456-426614174000"
tagihan_id: "456e7890-e89b-12d3-a456-426614174000"
amount: 100000
status: "pending"
payment_date: "2025-06-12T10:00:00Z"
note: null
created_at: "2025-06-12T10:00:00Z"
updated_at: "2025-06-12T10:00:00Z"

#### Jenis Tagihan

Deskripsi: Menyimpan kategori tagihan (misalnya, iuran bulanan, kegiatan).
Kolom:
id (UUID, primary key)
name (varchar(50))
amount (bigint, default, opsional)
description (text, opsional)
created_at (timestamp, default: now())
updated_at (timestamp, default: now(), update on change)

Relasi: 1:N dengan tagihan.
Contoh Data:id: "890e1234-e89b-12d3-a456-426614174000"
name: "Iuran Bulanan"
amount: 100000
description: "Iuran bulanan untuk kebutuhan pesantren"
created_at: "2025-06-11T11:00:00Z"
updated_at: "2025-06-11T11:00:00Z"

### 2.2 Relasi Antar Tabel

Users ↔ Santri: 1:1 (setiap santri memiliki satu akun di users).
Kelas ↔ Santri: 1:N (satu kelas memiliki banyak santri).
Santri ↔ Tagihan: 1:N (satu santri memiliki banyak tagihan).
Santri ↔ Transaksi: 1:N (satu santri memiliki banyak transaksi).
Jenis Tagihan ↔ Tagihan: 1:N (satu jenis tagihan digunakan untuk banyak tagihan).
Tagihan ↔ Transaksi: 1:1 (satu transaksi terkait dengan satu tagihan, opsional untuk pembayaran ad-hoc).

### 2.3 Diagram ERD
[Users] --1:1--> [Santri] --1:N--> [Tagihan]
  |                   |
  |                   1:N
  |                   |
  v                  [Transaksi]
[Kelas] --1:N--> [Santri]
[Jenis Tagihan] --1:N--> [Tagihan]

## 3. Fitur Sistem
### 3.1 Santri (PWA di Android)

Login: Autentikasi menggunakan username dan password.
Dashboard:
Menampilkan saldo saat ini, tagihan aktif, dan riwayat transaksi.
Notifikasi untuk tagihan jatuh tempo atau status pembayaran.

Pembayaran:
Pilih tagihan dari daftar atau masukkan jumlah untuk pembayaran ad-hoc.
Status pembayaran (pending, approved, rejected).

Profil: Melihat dan memperbarui data pribadi (nama, nomor telepon).
Offline Mode: Akses dasar ke saldo dan riwayat transaksi saat offline.

### 3.2 Admin (Web)

Login: Autentikasi dengan keamanan tinggi (JWT).
Manajemen Santri:
Tambah, edit, hapus santri.
Pindahkan santri antar kelas.
Cari/filter santri berdasarkan nama atau kelas.

Manajemen Kelas:
Tambah, edit, hapus kelas.
Lihat daftar santri per kelas.

Manajemen Tagihan:
Buat tagihan individu atau massal (per kelas/semua santri).
Edit atau hapus tagihan.
Tandai tagihan sebagai overdue jika melewati due_date.

Manajemen Transaksi:
Lihat semua transaksi, filter berdasarkan status atau santri.
Setujui/tolak transaksi dengan catatan.

Laporan:
Statistik: Total tagihan, pembayaran, tagihan tertunda.
Grafik: Tren pembayaran per bulan (menggunakan Chart.js).
Ekspor laporan ke PDF/Excel.

Pengaturan:
Kelola jenis tagihan (tambah/edit/hapus).
Atur pengingat otomatis untuk tagihan.

## 4. Teknologi

### 4.1 Frontend
Next.js (App Router): Struktur modular, SEO-friendly, dan mendukung PWA.
Tailwind CSS: Styling responsif dan cepat.
React Query: Pengelolaan data API secara efisien.
NextAuth.js: Autentikasi berbasis JWT.

### 4.2 Backend
Node.js + Express: API RESTful untuk manajemen data.
Prisma ORM: Interaksi database yang mudah dan aman.
PostgreSQL: Database relasional untuk produksi (SQLite untuk pengembangan).

### 4.3 PWA
@vite-pwa/next: Mendukung offline mode, caching, dan instalasi di Android.

### 4.4 Keamanan
Bcrypt: Enkripsi password.
JWT: Token untuk autentikasi sesi.
CORS: Kontrol akses API.

## 5. Alur Pengguna
### 5.1 Santri

Buka PWA di Android (atau instal dari browser Chrome).
Login dengan username dan password.
Lihat dashboard: saldo, tagihan aktif, riwayat transaksi.
Pilih tagihan atau masukkan jumlah untuk pembayaran ad-hoc, lalu ajukan pembayaran.
Terima notifikasi (di PWA) tentang status pembayaran (pending/approved/rejected).

### 5.2 Admin

Login ke web melalui browser dengan kredensial admin.
Lihat dashboard: Statistik santri, tagihan, dan transaksi.
Kelola santri: Tambah, edit, hapus, atau pindahkan ke kelas lain.
Kelola tagihan: Buat tagihan massal/individu, edit, atau hapus.
Tinjau transaksi: Setujui/tolak dengan catatan.
Buat laporan: Lihat statistik, grafik, atau ekspor ke PDF/Excel.

## 6. API Endpoint
Berikut adalah endpoint API utama dengan contoh request dan response.

### 6.1 Users

POST /api/login

Deskripsi: Autentikasi pengguna.
Request:{
  "username": "santri1",
  "password": "12345",
  "role": "santri"
}

Response (200):{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "username": "santri1",
    "role": "santri"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

POST /api/users

Deskripsi: Tambah pengguna (admin only).
Request:{
  "username": "santri2",
  "password": "12345",
  "role": "santri"
}

Response (201):{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "username": "santri2",
    "role": "santri"
  }
}

### 6.2 Santri

GET /api/santri

Deskripsi: Ambil daftar santri (admin only).
Response (200):[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Ahmad Fauzi",
    "santri_id": "S12345",
    "kelas_id": "789e1234-e89b-12d3-a456-426614174000",
    "balance": 500000
  }
]

POST /api/santri

Deskripsi: Tambah santri (admin only).
Request:{
  "user_id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Budi Santoso",
  "santri_id": "S12346",
  "kelas_id": "789e1234-e89b-12d3-a456-426614174000",
  "balance": 0,
  "phone": "081234567891"
}

Response (201):{ "success": true }

PUT /api/santri/:id

Deskripsi: Edit santri (admin only).
Request:{
  "name": "Budi Santoso Updated",
  "kelas_id": "789e1234-e89b-12d3-a456-426614174001"
}

Response (200):{ "success": true }

DELETE /api/santri/:id

Deskripsi: Hapus santri (admin only).
Response (200):{ "success": true }

### 6.3 Kelas

GET /api/kelas

Deskripsi: Ambil daftar kelas (admin only).
Response (200):[
  {
    "id": "789e1234-e89b-12d3-a456-426614174000",
    "name": "1A",
    "level": "Tsanawiyah"
  }
]

POST /api/kelas

Deskripsi: Tambah kelas (admin only).
Request:{
  "name": "1B",
  "level": "Tsanawiyah"
}

Response (201):{ "success": true }

### 6.4 Tagihan

GET /api/tagihan

Deskripsi: Ambil daftar tagihan (admin only).
Response (200):[
  {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "santri_id": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 100000,
    "due_date": "2025-07-01",
    "status": "pending"
  }
]

GET /api/tagihan/santri/:santriId

Deskripsi: Ambil tagihan santri (santri/admin).
Response (200):[
  {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "amount": 100000,
    "due_date": "2025-07-01",
    "status": "pending"
  }
]

POST /api/tagihan

Deskripsi: Buat tagihan (admin only).
Request:{
  "santri_id": "123e4567-e89b-12d3-a456-426614174000",
  "jenis_tagihan_id": "890e1234-e89b-12d3-a456-426614174000",
  "amount": 100000,
  "due_date": "2025-07-01",
  "description": "Iuran bulanan Juli"
}

Response (201):{ "success": true }

### 6.5 Transaksi

GET /api/transaksi

Deskripsi: Ambil semua transaksi (admin only).
Response (200):[
  {
    "id": "678e9012-e89b-12d3-a456-426614174000",
    "santri_id": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 100000,
    "status": "pending",
    "payment_date": "2025-06-12T10:00:00Z"
  }
]

GET /api/transaksi/santri/:santriId

Deskripsi: Ambil transaksi santri (santri/admin).
Response (200):[
  {
    "id": "678e9012-e89b-12d3-a456-426614174000",
    "amount": 100000,
    "status": "pending",
    "payment_date": "2025-06-12T10:00:00Z"
  }
]

POST /api/transaksi

Deskripsi: Ajukan pembayaran (santri).
Request:{
  "santri_id": "123e4567-e89b-12d3-a456-426614174000",
  "tagihan_id": "456e7890-e89b-12d3-a456-426614174000",
  "amount": 100000
}

Response (201):{ "success": true }

POST /api/transaksi/:id/approve

Deskripsi: Setujui transaksi (admin only).
Request:{ "note": "Pembayaran diterima" }

Response (200):{ "success": true }

POST /api/transaksi/:id/reject

Deskripsi: Tolak transaksi (admin only).
Request:{ "note": "Bukti pembayaran tidak valid" }

Response (200):{ "success": true }

### 6.6 Jenis Tagihan

GET /api/jenis-tagihan

Deskripsi: Ambil daftar jenis tagihan (admin only).
Response (200):[
  {
    "id": "890e1234-e89b-12d3-a456-426614174000",
    "name": "Iuran Bulanan",
    "amount": 100000
  }
]

POST /api/jenis-tagihan

Deskripsi: Tambah jenis tagihan (admin only).
Request:{
  "name": "Kegiatan Pesantren",
  "amount": 50000,
  "description": "Biaya kegiatan tahunan"
}

Response (201):{ "success": true }

## 7. Deployment

### 7.1 Frontend (Vercel)
1. Setup Repository:
   - Buat repository di GitHub
   - Push kode frontend ke repository
   - Hubungkan dengan Vercel

2. Konfigurasi:
   - Set environment variables (API_URL, NEXT_PUBLIC_*)
   - Konfigurasi build settings
   - Setup domain custom (opsional)

3. Deployment:
   - Otomatis dari main branch
   - Preview deployments untuk branch lain

### 7.2 Backend (Render/Heroku)
1. Setup:
   - Buat aplikasi baru di Render/Heroku
   - Hubungkan dengan repository
   - Set environment variables

2. Database:
   - Setup PostgreSQL instance
   - Konfigurasi connection string
   - Jalankan migrasi database

3. Deployment:
   - Otomatis dari main branch
   - Setup health check endpoint
   - Konfigurasi SSL

### 7.3 Monitoring
1. Logs:
   - Setup error tracking (Sentry)
   - Monitor application logs
   - Setup alerting

2. Performance:
   - Monitor response times
   - Track resource usage
   - Setup uptime monitoring

## 8. Keamanan

Enkripsi Password: Gunakan bcrypt untuk mengenkripsi password di users.
Autentikasi: JWT untuk sesi pengguna, dengan masa berlaku 1 jam.
Otorisasi: Batasi akses API berdasarkan role (admin untuk manajemen, santri untuk dashboard).
HTTPS: Wajib untuk semua request API.
Validasi Input: Gunakan library seperti zod untuk validasi data di backend.
Rate Limiting: Terapkan rate limiting (misalnya, dengan express-rate-limit) untuk mencegah brute force.

## 9. Pengujian
### 9.1 Frontend

Unit Testing: Gunakan Jest dan React Testing Library untuk menguji komponen seperti LoginForm.
E2E Testing: Gunakan Cypress untuk menguji alur login, dashboard, dan pembayaran.
PWA Testing: Uji instalasi PWA di Android dan mode offline menggunakan Chrome DevTools.

### 9.2 Backend

API Testing: Gunakan Postman atau Jest untuk menguji endpoint (misalnya, /api/login, /api/santri).
Load Testing: Gunakan k6 untuk menguji performa dengan 1000+ santri.

### 9.3 Fungsional

Uji alur lengkap: Login → Ajukan pembayaran → Setujui/tolak → Lihat laporan.
Uji responsivitas: Dashboard admin di desktop, PWA di Android.

## 10. Skalabilitas

Database: Gunakan indexing pada kolom seperti santri_id, tagihan_id untuk performa.
Caching: Gunakan Redis untuk cache data statis (misalnya, daftar kelas).
Load Balancing: Terapkan load balancer untuk backend jika jumlah pengguna besar.
PWA: Optimalkan caching dengan service worker untuk performa offline.

## 11. Rencana Pengembangan Lanjutan

Integrasi Gateway Pembayaran: Midtrans/Xendit untuk pembayaran via QR code atau bank/ewallet.
Notifikasi Push: Gunakan Web Push API untuk notifikasi di PWA.
Multi-Bahasa: Dukungan bahasa Indonesia dan Arab dengan next-intl.
Manajemen Multi-Admin: Tambahkan role seperti "admin keuangan" dan "admin data".
Integrasi Sistem Lain: Sinkronisasi dengan sistem kehadiran atau akademik pesantren.

## 12. Catatan

Dokumentasi ini dirancang untuk tahap pengembangan awal dan dapat diperbarui.
Pastikan backup database rutin dan monitoring server untuk produksi.
Konsultasikan dengan pihak pesantren untuk kebutuhan spesifik (misalnya, jenis tagihan atau laporan).

