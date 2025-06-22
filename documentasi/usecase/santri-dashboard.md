# Use Case Diagram — Santri: Lihat Dashboard

Diagram berikut menggambarkan skenario utama dalam proses santri melihat dashboard pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Dashboard)
  (Lihat Dashboard) ..> (Lihat Saldo) : include
  (Lihat Dashboard) ..> (Lihat Tagihan Aktif) : include
  (Lihat Dashboard) ..> (Lihat Riwayat Transaksi) : include
  (Lihat Dashboard) ..> (Lihat Notifikasi) : include
```

## Penjelasan Use Case
- **Lihat Dashboard:** Santri mengakses halaman utama setelah login.

### Include:
- **Lihat Saldo:** Menampilkan saldo santri saat ini.
- **Lihat Tagihan Aktif:** Menampilkan daftar tagihan yang harus dibayar.
- **Lihat Riwayat Transaksi:** Menampilkan riwayat pembayaran/tagihan.
- **Lihat Notifikasi:** Menampilkan notifikasi penting terkait pembayaran/tagihan.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Dashboard)
  (Lihat Dashboard) ..> (Lihat Saldo) : include
  (Lihat Dashboard) ..> (Lihat Tagihan Aktif) : include
  (Lihat Dashboard) ..> (Lihat Riwayat Transaksi) : include
  (Lihat Dashboard) ..> (Lihat Notifikasi) : include
``` 