# DFD Level 2 — Manajemen Transaksi Pembayaran

Diagram berikut menggambarkan detail subproses pada manajemen transaksi pembayaran (ajukan pembayaran, approval, reject).

```mermaid
flowchart TD
  Santri((Santri))
  Admin((Admin))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]

  Santri -- "Ajukan Pembayaran (tagihan, nominal, bukti)" --> System
  System -- "Validasi Data Pembayaran" --> System
  System -- "Cek Tagihan Valid & Belum Lunas" --> DBTagihan
  DBTagihan -- "Status Tagihan" --> System
  System -- "Buat Data Transaksi (pending)" --> DBTransaksi
  System -- "Update Status Tagihan (pending)" --> DBTagihan
  System -- "Tampilkan Status Pengajuan" --> Santri

  Admin -- "Lihat Daftar Transaksi" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  DBTransaksi -- "Data Transaksi" --> System
  System -- "Tampilkan Data Transaksi" --> Admin

  Admin -- "Setujui Pembayaran" --> System
  System -- "Validasi Bukti Pembayaran" --> System
  System -- "Update Status Transaksi (approved)" --> DBTransaksi
  System -- "Update Status Tagihan (paid)" --> DBTagihan
  System -- "Tampilkan Status ke Santri" --> Santri

  Admin -- "Tolak Pembayaran (alasan)" --> System
  System -- "Update Status Transaksi (rejected)" --> DBTransaksi
  System -- "Update Status Tagihan (pending/overdue)" --> DBTagihan
  System -- "Tampilkan Status & Alasan ke Santri" --> Santri
```

## Penjelasan
- **Ajukan Pembayaran:** Melibatkan validasi data, cek tagihan, simpan transaksi, update status tagihan.
- **Approval/Reject:** Admin memvalidasi, mengubah status transaksi & tagihan, dan menampilkan hasil ke santri.

---

### Kode Mermaid
```mermaid
flowchart TD
  Santri((Santri))
  Admin((Admin))
  System([Santri Pay System])
  DBTransaksi[(Tabel Transaksi)]
  DBTagihan[(Tabel Tagihan)]

  Santri -- "Ajukan Pembayaran (tagihan, nominal, bukti)" --> System
  System -- "Validasi Data Pembayaran" --> System
  System -- "Cek Tagihan Valid & Belum Lunas" --> DBTagihan
  DBTagihan -- "Status Tagihan" --> System
  System -- "Buat Data Transaksi (pending)" --> DBTransaksi
  System -- "Update Status Tagihan (pending)" --> DBTagihan
  System -- "Tampilkan Status Pengajuan" --> Santri

  Admin -- "Lihat Daftar Transaksi" --> System
  System -- "Ambil Data Transaksi" --> DBTransaksi
  DBTransaksi -- "Data Transaksi" --> System
  System -- "Tampilkan Data Transaksi" --> Admin

  Admin -- "Setujui Pembayaran" --> System
  System -- "Validasi Bukti Pembayaran" --> System
  System -- "Update Status Transaksi (approved)" --> DBTransaksi
  System -- "Update Status Tagihan (paid)" --> DBTagihan
  System -- "Tampilkan Status ke Santri" --> Santri

  Admin -- "Tolak Pembayaran (alasan)" --> System
  System -- "Update Status Transaksi (rejected)" --> DBTransaksi
  System -- "Update Status Tagihan (pending/overdue)" --> DBTagihan
  System -- "Tampilkan Status & Alasan ke Santri" --> Santri
``` 