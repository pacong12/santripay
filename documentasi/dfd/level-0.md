# DFD Level 0 (Context Diagram) — Santri Pay

Diagram berikut menggambarkan konteks utama sistem Santri Pay, aktor eksternal, dan aliran data utama pada level paling atas.

```mermaid
flowchart TD
  Admin((Admin))
  Santri((Santri))
  System([Santri Pay System])

  Admin -- "Data Santri, Kelas, Tagihan, Transaksi, Laporan, Pengaturan" --> System
  System -- "Laporan, Notifikasi, Status Pembayaran, Data" --> Admin

  Santri -- "Data Pembayaran, Profil, Tagihan, Permintaan Pembayaran" --> System
  System -- "Tagihan, Status Pembayaran, Notifikasi, Saldo, Riwayat" --> Santri
```

## Penjelasan
- **Admin**: Mengelola data, memantau transaksi, mengatur sistem, menerima laporan & notifikasi.
- **Santri**: Melihat tagihan, mengajukan pembayaran, mengelola profil, menerima notifikasi & status pembayaran.
- **System**: Santri Pay sebagai pusat pemrosesan data dan layanan.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  Santri((Santri))
  System([Santri Pay System])

  Admin -- "Data Santri, Kelas, Tagihan, Transaksi, Laporan, Pengaturan" --> System
  System -- "Laporan, Notifikasi, Status Pembayaran, Data" --> Admin

  Santri -- "Data Pembayaran, Profil, Tagihan, Permintaan Pembayaran" --> System
  System -- "Tagihan, Status Pembayaran, Notifikasi, Saldo, Riwayat" --> Santri
``` 