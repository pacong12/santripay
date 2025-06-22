# Activity Diagram — Approval Pembayaran (Admin)

Diagram berikut menggambarkan alur aktivitas pada proses approval pembayaran oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatTransaksi["Lihat daftar transaksi pending"]
  PilihTransaksi["Pilih transaksi untuk approval"]
  ValidasiBukti["Validasi bukti pembayaran"]
  BuktiValid["Bukti valid?"]
  UpdateTransaksi["Update status transaksi (approved)"]
  UpdateTagihan["Update status tagihan (paid)"]
  NotifSukses["Kirim notifikasi ke santri"]
  Sukses([Tampilkan status approval berhasil])
  UpdateTransaksiR["Update status transaksi (rejected)"]
  UpdateTagihanR["Update status tagihan (pending/overdue)"]
  NotifGagal["Kirim notifikasi penolakan ke santri"]
  Gagal([Tampilkan status approval gagal])
  End([End])

  Start --> LihatTransaksi --> PilihTransaksi --> ValidasiBukti --> BuktiValid
  BuktiValid -- Ya --> UpdateTransaksi --> UpdateTagihan --> NotifSukses --> Sukses --> End
  BuktiValid -- Tidak --> UpdateTransaksiR --> UpdateTagihanR --> NotifGagal --> Gagal --> End
```

## Penjelasan
- Admin melihat daftar transaksi, memilih transaksi, validasi bukti pembayaran.
- Jika valid, update status transaksi & tagihan, kirim notifikasi sukses ke santri. Jika tidak valid, update status rejected, kirim notifikasi gagal.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatTransaksi["Lihat daftar transaksi pending"]
  PilihTransaksi["Pilih transaksi untuk approval"]
  ValidasiBukti["Validasi bukti pembayaran"]
  BuktiValid["Bukti valid?"]
  UpdateTransaksi["Update status transaksi (approved)"]
  UpdateTagihan["Update status tagihan (paid)"]
  NotifSukses["Kirim notifikasi ke santri"]
  Sukses([Tampilkan status approval berhasil])
  UpdateTransaksiR["Update status transaksi (rejected)"]
  UpdateTagihanR["Update status tagihan (pending/overdue)"]
  NotifGagal["Kirim notifikasi penolakan ke santri"]
  Gagal([Tampilkan status approval gagal])
  End([End])

  Start --> LihatTransaksi --> PilihTransaksi --> ValidasiBukti --> BuktiValid
  BuktiValid -- Ya --> UpdateTransaksi --> UpdateTagihan --> NotifSukses --> Sukses --> End
  BuktiValid -- Tidak --> UpdateTransaksiR --> UpdateTagihanR --> NotifGagal --> Gagal --> End
``` 