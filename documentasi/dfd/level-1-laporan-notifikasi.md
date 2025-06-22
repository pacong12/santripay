# DFD Level 1 — Laporan & Notifikasi

Diagram berikut menggambarkan detail aliran data untuk proses laporan dan notifikasi pada sistem Santri Pay.

```mermaid
flowchart TD
  Admin((Admin))
  Santri((Santri))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]
  DBUser[(Tabel User)]
  DBNotifikasi[(Tabel Notifikasi)]

  Admin -- "Minta Laporan/Statistik" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  System -- "Ambil Data Tagihan" --> DBTagihan
  System -- "Ambil Data User" --> DBUser
  DBTransaksi -- "Data Transaksi" --> System
  DBTagihan -- "Data Tagihan" --> System
  DBUser -- "Data User" --> System
  System -- "Generate Laporan/Statistik" --> Admin

  System -- "Kirim Notifikasi (pembayaran, tagihan, dsb)" --> DBNotifikasi
  DBNotifikasi -- "Notifikasi" --> System
  System -- "Tampilkan Notifikasi" --> Admin
  System -- "Tampilkan Notifikasi" --> Santri

  Santri -- "Aksi (pembayaran, update profil, dsb)" --> System
  System -- "Trigger Notifikasi" --> DBNotifikasi
```

## Penjelasan
- **Admin** meminta laporan/statistik, sistem mengambil data dan menghasilkan laporan.
- **System** mengirim notifikasi ke admin/santri berdasarkan aksi (pembayaran, tagihan, dsb).
- **Notifikasi** disimpan di tabel Notifikasi dan ditampilkan ke user terkait.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  Santri((Santri))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]
  DBUser[(Tabel User)]
  DBNotifikasi[(Tabel Notifikasi)]

  Admin -- "Minta Laporan/Statistik" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  System -- "Ambil Data Tagihan" --> DBTagihan
  System -- "Ambil Data User" --> DBUser
  DBTransaksi -- "Data Transaksi" --> System
  DBTagihan -- "Data Tagihan" --> System
  DBUser -- "Data User" --> System
  System -- "Generate Laporan/Statistik" --> Admin

  System -- "Kirim Notifikasi (pembayaran, tagihan, dsb)" --> DBNotifikasi
  DBNotifikasi -- "Notifikasi" --> System
  System -- "Tampilkan Notifikasi" --> Admin
  System -- "Tampilkan Notifikasi" --> Santri

  Santri -- "Aksi (pembayaran, update profil, dsb)" --> System
  System -- "Trigger Notifikasi" --> DBNotifikasi
``` 