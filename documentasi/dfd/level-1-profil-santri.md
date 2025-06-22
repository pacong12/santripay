# DFD Level 1 — Manajemen Profil Santri

Diagram berikut menggambarkan detail aliran data untuk proses manajemen profil santri pada sistem Santri Pay.

```mermaid
flowchart TD
  Santri((Santri))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]

  Santri -- "Lihat Profil" --> System
  System -- "Ambil Data Profil (User & Santri)" --> DBUser
  System -- "Ambil Data Profil (User & Santri)" --> DBSantri
  DBUser -- "Data User" --> System
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Profil" --> Santri

  Santri -- "Edit Profil (nama, email, phone, dsb)" --> System
  System -- "Validasi Data Profil" --> System
  System -- "Update Data User" --> DBUser
  System -- "Update Data Santri" --> DBSantri
  System -- "Tampilkan Status Update" --> Santri
```

## Penjelasan
- **Santri** melihat dan mengedit data profilnya.
- **System** mengambil dan mengupdate data di tabel User & Santri, serta menampilkan hasil ke santri.

---

### Kode Mermaid
```mermaid
flowchart TD
  Santri((Santri))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]

  Santri -- "Lihat Profil" --> System
  System -- "Ambil Data Profil (User & Santri)" --> DBUser
  System -- "Ambil Data Profil (User & Santri)" --> DBSantri
  DBUser -- "Data User" --> System
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Profil" --> Santri

  Santri -- "Edit Profil (nama, email, phone, dsb)" --> System
  System -- "Validasi Data Profil" --> System
  System -- "Update Data User" --> DBUser
  System -- "Update Data Santri" --> DBSantri
  System -- "Tampilkan Status Update" --> Santri
``` 