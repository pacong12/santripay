# Use Case Diagram — Admin

Diagram berikut menggambarkan fitur utama yang dapat diakses oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Login)
  Admin --> (Tambah Santri)
  Admin --> (Edit Santri)
  Admin --> (Hapus Santri)
  Admin --> (Pindahkan Santri ke Kelas Lain)
  Admin --> (Lihat Daftar Santri)
  Admin --> (Tambah Kelas)
  Admin --> (Edit Kelas)
  Admin --> (Hapus Kelas)
  Admin --> (Lihat Daftar Kelas)
  Admin --> (Buat Tagihan Individu)
  Admin --> (Buat Tagihan Massal)
  Admin --> (Edit Tagihan)
  Admin --> (Hapus Tagihan)
  Admin --> (Lihat Daftar Tagihan)
  Admin --> (Tambah Jenis Tagihan)
  Admin --> (Edit Jenis Tagihan)
  Admin --> (Hapus Jenis Tagihan)
  Admin --> (Lihat Daftar Jenis Tagihan)
  Admin --> (Lihat Daftar Transaksi)
  Admin --> (Setujui Pembayaran)
  Admin --> (Tolak Pembayaran)
  Admin --> (Lihat Statistik)
  Admin --> (Ekspor Laporan)
  Admin --> (Atur Preferensi Notifikasi)
  Admin --> (Atur Tahun Ajaran Aktif)
```

## Daftar Use Case Utama Admin
- Login ke sistem
- Kelola santri (tambah, edit, hapus, pindah kelas, lihat daftar)
- Kelola kelas (tambah, edit, hapus, lihat daftar)
- Kelola tagihan (buat individu/massal, edit, hapus, lihat daftar)
- Kelola jenis tagihan (tambah, edit, hapus, lihat daftar)
- Kelola transaksi (lihat daftar, setujui, tolak)
- Lihat statistik dan ekspor laporan
- Kelola pengaturan sistem (notifikasi, tahun ajaran) 