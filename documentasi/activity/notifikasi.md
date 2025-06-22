# Activity Diagram — Notifikasi (Trigger & Delivery)

Diagram berikut menggambarkan alur aktivitas pada proses trigger dan pengiriman notifikasi pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  AksiUser["User melakukan aksi (pembayaran, approval, dsb)"]
  TriggerNotif["Sistem trigger notifikasi"]
  SimpanNotif["Simpan notifikasi ke database"]
  Loop{User buka aplikasi/halaman?}
  AmbilNotif["Ambil notifikasi dari database"]
  TampilkanNotif["Tampilkan notifikasi ke user"]
  End([End])

  Start --> AksiUser --> TriggerNotif --> SimpanNotif --> Loop
  Loop -- Ya --> AmbilNotif --> TampilkanNotif --> End
  Loop -- Tidak --> End
```

## Penjelasan
- Setiap aksi penting akan trigger notifikasi di backend dan disimpan ke database.
- Saat user membuka aplikasi/halaman, sistem mengambil dan menampilkan notifikasi.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  AksiUser["User melakukan aksi (pembayaran, approval, dsb)"]
  TriggerNotif["Sistem trigger notifikasi"]
  SimpanNotif["Simpan notifikasi ke database"]
  Loop{User buka aplikasi/halaman?}
  AmbilNotif["Ambil notifikasi dari database"]
  TampilkanNotif["Tampilkan notifikasi ke user"]
  End([End])

  Start --> AksiUser --> TriggerNotif --> SimpanNotif --> Loop
  Loop -- Ya --> AmbilNotif --> TampilkanNotif --> End
  Loop -- Tidak --> End
``` 