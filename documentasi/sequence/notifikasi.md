# Sequence Diagram — Notifikasi (Trigger & Delivery)

Diagram berikut menggambarkan urutan interaksi pada proses trigger dan pengiriman notifikasi pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant Actor as Santri/Admin
  participant UI as Frontend
  participant API as Backend API
  participant DB as Database
  participant Target as Penerima Notifikasi

  Actor->>UI: Lakukan aksi (pembayaran, approval, dsb)
  UI->>API: Kirim request aksi
  API->>DB: Update data (transaksi/tagihan/dsb)
  API->>DB: Simpan notifikasi (userId, message, type)
  API-->>UI: Kirim status aksi
  UI-->>Actor: Tampilkan status aksi

  loop polling/notifikasi real-time
    Target->>UI: Buka aplikasi/halaman
    UI->>API: Request notifikasi (userId)
    API->>DB: Query notifikasi (userId)
    DB-->>API: Data notifikasi
    API-->>UI: Kirim data notifikasi
    UI-->>Target: Tampilkan notifikasi
  end
```

## Penjelasan
- Setiap aksi penting (pembayaran, approval, dsb) akan trigger notifikasi di backend.
- Notifikasi disimpan di database dan diambil oleh user saat membuka aplikasi/halaman (polling atau real-time).

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant Actor as Santri/Admin
  participant UI as Frontend
  participant API as Backend API
  participant DB as Database
  participant Target as Penerima Notifikasi

  Actor->>UI: Lakukan aksi (pembayaran, approval, dsb)
  UI->>API: Kirim request aksi
  API->>DB: Update data (transaksi/tagihan/dsb)
  API->>DB: Simpan notifikasi (userId, message, type)
  API-->>UI: Kirim status aksi
  UI-->>Actor: Tampilkan status aksi

  loop polling/notifikasi real-time
    Target->>UI: Buka aplikasi/halaman
    UI->>API: Request notifikasi (userId)
    API->>DB: Query notifikasi (userId)
    DB-->>API: Data notifikasi
    API-->>UI: Kirim data notifikasi
    UI-->>Target: Tampilkan notifikasi
  end
``` 