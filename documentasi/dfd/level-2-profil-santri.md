# DFD Level 2 — Manajemen Profil Santri

Diagram berikut menggambarkan detail subproses pada manajemen profil santri (lihat & edit profil).

```mermaid
flowchart TD
  Santri((Santri))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]

  Santri -- "Lihat Profil" --> System
  System -- "Ambil Data User" --> DBUser
  System -- "Ambil Data Santri" --> DBSantri
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
- **Lihat Profil:** Sistem mengambil data user & santri lalu menampilkannya ke santri.
- **Edit Profil:** Sistem memvalidasi, mengupdate data user & santri, lalu menampilkan status ke santri.

---

### Kode Mermaid
```mermaid
flowchart TD
  Santri((Santri))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]

  Santri -- "Lihat Profil" --> System
  System -- "Ambil Data User" --> DBUser
  System -- "Ambil Data Santri" --> DBSantri
  DBUser -- "Data User" --> System
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Profil" --> Santri

  Santri -- "Edit Profil (nama, email, phone, dsb)" --> System
  System -- "Validasi Data Profil" --> System
  System -- "Update Data User" --> DBUser
  System -- "Update Data Santri" --> DBSantri
  System -- "Tampilkan Status Update" --> Santri
``` 