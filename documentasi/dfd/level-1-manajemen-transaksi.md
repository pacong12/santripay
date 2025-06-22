# DFD Level 1 — Manajemen Transaksi Pembayaran

Diagram berikut menggambarkan detail aliran data untuk proses manajemen transaksi pembayaran pada sistem Santri Pay.

```mermaid
flowchart TD
  Santri((Santri))
  Admin((Admin))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]
  DBSantri[(Tabel Santri)]

  Santri -- "Ajukan Pembayaran (tagihan, nominal, bukti)" --> System
  System -- "Validasi Data Pembayaran" --> System
  System -- "Buat Data Transaksi (relasi ke tagihan & santri)" --> DBTransaksi
  System -- "Update Status Tagihan (pending)" --> DBTagihan
  System -- "Tampilkan Status Pengajuan" --> Santri

  Admin -- "Lihat Daftar Transaksi" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  DBTransaksi -- "Data Transaksi" --> System
  System -- "Tampilkan Data Transaksi" --> Admin

  Admin -- "Setujui Pembayaran" --> System
  System -- "Update Status Transaksi (approved)" --> DBTransaksi
  System -- "Update Status Tagihan (paid)" --> DBTagihan
  System -- "Tampilkan Status ke Santri" --> Santri

  Admin -- "Tolak Pembayaran (alasan)" --> System
  System -- "Update Status Transaksi (rejected)" --> DBTransaksi
  System -- "Update Status Tagihan (pending/overdue)" --> DBTagihan
  System -- "Tampilkan Status & Alasan ke Santri" --> Santri
```

## Penjelasan
- **Santri** mengajukan pembayaran, sistem memvalidasi dan mencatat transaksi.
- **Admin** memantau, menyetujui, atau menolak transaksi pembayaran.
- **System** mengupdate status transaksi dan tagihan, serta menampilkan status ke santri.

---

### Kode Mermaid
```mermaid
flowchart TD
  Santri((Santri))
  Admin((Admin))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]
  DBSantri[(Tabel Santri)]

  Santri -- "Ajukan Pembayaran (tagihan, nominal, bukti)" --> System
  System -- "Validasi Data Pembayaran" --> System
  System -- "Buat Data Transaksi (relasi ke tagihan & santri)" --> DBTransaksi
  System -- "Update Status Tagihan (pending)" --> DBTagihan
  System -- "Tampilkan Status Pengajuan" --> Santri

  Admin -- "Lihat Daftar Transaksi" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  DBTransaksi -- "Data Transaksi" --> System
  System -- "Tampilkan Data Transaksi" --> Admin

  Admin -- "Setujui Pembayaran" --> System
  System -- "Update Status Transaksi (approved)" --> DBTransaksi
  System -- "Update Status Tagihan (paid)" --> DBTagihan
  System -- "Tampilkan Status ke Santri" --> Santri

  Admin -- "Tolak Pembayaran (alasan)" --> System
  System -- "Update Status Transaksi (rejected)" --> DBTransaksi
  System -- "Update Status Tagihan (pending/overdue)" --> DBTagihan
  System -- "Tampilkan Status & Alasan ke Santri" --> Santri
``` 