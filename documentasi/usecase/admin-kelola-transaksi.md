# Use Case Diagram — Admin: Kelola Transaksi

Diagram berikut menggambarkan skenario utama dalam proses kelola transaksi oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Lihat Daftar Transaksi)
  Admin --> (Setujui Pembayaran)
  Admin --> (Tolak Pembayaran)
  (Setujui Pembayaran) ..> (Verifikasi Bukti Pembayaran) : include
  (Tolak Pembayaran) ..> (Input Alasan Penolakan) : include
```

## Penjelasan Use Case
- **Lihat Daftar Transaksi:** Admin melihat/mencari daftar transaksi pembayaran santri.
- **Setujui Pembayaran:** Admin menyetujui transaksi pembayaran setelah verifikasi.
- **Tolak Pembayaran:** Admin menolak transaksi pembayaran dan menginput alasan penolakan.

### Include:
- **Verifikasi Bukti Pembayaran:** Proses pengecekan bukti pembayaran sebelum approval.
- **Input Alasan Penolakan:** Admin mengisi alasan saat menolak pembayaran.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Lihat Daftar Transaksi)
  Admin --> (Setujui Pembayaran)
  Admin --> (Tolak Pembayaran)
  (Setujui Pembayaran) ..> (Verifikasi Bukti Pembayaran) : include
  (Tolak Pembayaran) ..> (Input Alasan Penolakan) : include
``` 