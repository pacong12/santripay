# Sequence Diagram — Edit Profil (Santri)

Diagram berikut menggambarkan urutan interaksi pada proses edit profil oleh Santri pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant Santri as Santri
  participant UI as Frontend (Profil Page)
  participant API as Backend API
  participant DB as Database

  Santri->>UI: Edit data profil (nama, email, phone, dsb)
  UI->>API: Kirim request update profil
  API->>API: Validasi data profil
  API->>DB: Update data user
  API->>DB: Update data santri
  API-->>UI: Kirim status update (berhasil/gagal)
  UI-->>Santri: Tampilkan status update
```

## Penjelasan
- Santri mengedit data profil, frontend mengirim ke backend.
- Backend validasi data, update tabel user & santri, kirim status ke frontend.

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant Santri as Santri
  participant UI as Frontend (Profil Page)
  participant API as Backend API
  participant DB as Database

  Santri->>UI: Edit data profil (nama, email, phone, dsb)
  UI->>API: Kirim request update profil
  API->>API: Validasi data profil
  API->>DB: Update data user
  API->>DB: Update data santri
  API-->>UI: Kirim status update (berhasil/gagal)
  UI-->>Santri: Tampilkan status update
``` 