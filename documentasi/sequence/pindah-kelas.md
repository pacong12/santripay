# Sequence Diagram — Pindah Kelas (Admin)

Diagram berikut menggambarkan urutan interaksi pada proses pindah kelas santri oleh Admin pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant Admin as Admin
  participant UI as Frontend (Santri/Kelas Page)
  participant API as Backend API
  participant DB as Database

  Admin->>UI: Pilih santri & kelas baru
  UI->>API: Kirim request pindah kelas (santriId, kelasBaruId)
  API->>DB: Ambil data santri
  DB-->>API: Data santri (kelasLamaId)
  API->>DB: Ambil data kelas baru
  DB-->>API: Data kelas baru
  API->>DB: Update kelasId di santri
  API->>DB: Simpan riwayatKelas (santriId, kelasLamaId, kelasBaruId, tanggal)
  API-->>UI: Kirim status pindah kelas (berhasil/gagal)
  UI-->>Admin: Tampilkan status pindah kelas
```

## Penjelasan
- Admin memilih santri dan kelas baru, frontend mengirim ke backend.
- Backend ambil data santri & kelas, update kelasId, simpan riwayatKelas, dan kirim status ke admin.

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant Admin as Admin
  participant UI as Frontend (Santri/Kelas Page)
  participant API as Backend API
  participant DB as Database

  Admin->>UI: Pilih santri & kelas baru
  UI->>API: Kirim request pindah kelas (santriId, kelasBaruId)
  API->>DB: Ambil data santri
  DB-->>API: Data santri (kelasLamaId)
  API->>DB: Ambil data kelas baru
  DB-->>API: Data kelas baru
  API->>DB: Update kelasId di santri
  API->>DB: Simpan riwayatKelas (santriId, kelasLamaId, kelasBaruId, tanggal)
  API-->>UI: Kirim status pindah kelas (berhasil/gagal)
  UI-->>Admin: Tampilkan status pindah kelas
``` 