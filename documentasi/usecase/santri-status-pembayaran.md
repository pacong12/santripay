# Use Case Diagram — Santri: Lihat Status Pembayaran

Diagram berikut menggambarkan skenario utama dalam proses santri melihat status pembayaran pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Status Pembayaran)
  (Lihat Status Pembayaran) ..> (Lihat Daftar Pembayaran) : include
  (Lihat Status Pembayaran) ..> (Lihat Detail Status) : include
  (Lihat Status Pembayaran) ..> (Lihat Alasan Penolakan) : extend
```

## Penjelasan Use Case
- **Lihat Status Pembayaran:** Santri melihat status pembayaran yang telah diajukan (pending, approved, rejected).

### Include:
- **Lihat Daftar Pembayaran:** Menampilkan daftar pembayaran yang pernah diajukan.
- **Lihat Detail Status:** Menampilkan detail status pembayaran (tanggal, nominal, status).

### Extend:
- **Lihat Alasan Penolakan:** Jika pembayaran ditolak, santri dapat melihat alasan penolakan dari admin.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Status Pembayaran)
  (Lihat Status Pembayaran) ..> (Lihat Daftar Pembayaran) : include
  (Lihat Status Pembayaran) ..> (Lihat Detail Status) : include
  (Lihat Status Pembayaran) ..> (Lihat Alasan Penolakan) : extend
``` 