 # Sequence Diagram — Approval Pembayaran (Admin)

Diagram berikut menggambarkan urutan interaksi pada proses approval pembayaran oleh Admin pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant Admin as Admin
  participant UI as Frontend (Transaksi Page)
  participant API as Backend API
  participant DB as Database
  participant Santri as Santri

  Admin->>UI: Lihat daftar transaksi
  UI->>API: Request data transaksi
  API->>DB: Query transaksi (pending)
  DB-->>API: Data transaksi
  API-->>UI: Kirim data transaksi
  UI-->>Admin: Tampilkan daftar transaksi

  Admin->>UI: Pilih transaksi & klik Approve
  UI->>API: Kirim request approval (transaksiId)
  API->>DB: Update status transaksi (approved)
  API->>DB: Update status tagihan (paid)
  API->>DB: Simpan notifikasi ke santri
  API-->>UI: Kirim status approval (berhasil/gagal)
  UI-->>Admin: Tampilkan status approval
  API-->>Santri: Kirim notifikasi pembayaran diterima
```

## Penjelasan
- Admin melihat daftar transaksi, memilih transaksi, dan melakukan approval.
- Backend update status transaksi & tagihan, simpan notifikasi ke santri, dan mengirim status ke admin & santri.

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant Admin as Admin
  participant UI as Frontend (Transaksi Page)
  participant API as Backend API
  participant DB as Database
  participant Santri as Santri

  Admin->>UI: Lihat daftar transaksi
  UI->>API: Request data transaksi
  API->>DB: Query transaksi (pending)
  DB-->>API: Data transaksi
  API-->>UI: Kirim data transaksi
  UI-->>Admin: Tampilkan daftar transaksi

  Admin->>UI: Pilih transaksi & klik Approve
  UI->>API: Kirim request approval (transaksiId)
  API->>DB: Update status transaksi (approved)
  API->>DB: Update status tagihan (paid)
  API->>DB: Simpan notifikasi ke santri
  API-->>UI: Kirim status approval (berhasil/gagal)
  UI-->>Admin: Tampilkan status approval
  API-->>Santri: Kirim notifikasi pembayaran diterima
```
