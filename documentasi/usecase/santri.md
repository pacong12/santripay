# Use Case Diagram — Santri

Diagram berikut menggambarkan fitur utama yang dapat diakses oleh Santri pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Login)
  Santri --> (Lihat Dashboard)
  Santri --> (Lihat Saldo)
  Santri --> (Lihat Tagihan Aktif)
  Santri --> (Lihat Riwayat Transaksi)
  Santri --> (Ajukan Pembayaran)
  Santri --> (Lihat Status Pembayaran)
  Santri --> (Lihat & Edit Profil)
  Santri --> (Terima Notifikasi)
  Santri --> (Akses Offline Mode)
```

## Daftar Use Case Utama Santri
- Login ke sistem
- Lihat dashboard (saldo, tagihan, riwayat)
- Ajukan pembayaran tagihan
- Lihat status pembayaran (pending, approved, rejected)
- Lihat & edit profil
- Terima notifikasi (tagihan baru, jatuh tempo, pembayaran diterima/ditolak)
- Akses offline mode (PWA) 