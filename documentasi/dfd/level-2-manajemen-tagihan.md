# DFD Level 2 — Manajemen Tagihan & Jenis Tagihan

Diagram berikut menggambarkan detail subproses pada manajemen tagihan dan jenis tagihan (tambah, edit, hapus tagihan dan jenis tagihan).

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBTagihan[(Tabel Tagihan)]
  DBJenisTagihan[(Tabel JenisTagihan)]
  DBSantri[(Tabel Santri)]
  DBTahunAjaran[(Tabel TahunAjaran)]

  Admin -- "Input Data Tagihan" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Cek Santri & Jenis Tagihan Valid" --> DBSantri
  System -- "Cek Santri & Jenis Tagihan Valid" --> DBJenisTagihan
  System -- "Cek Tahun Ajaran Valid" --> DBTahunAjaran
  DBSantri -- "Status Santri" --> System
  DBJenisTagihan -- "Status Jenis Tagihan" --> System
  DBTahunAjaran -- "Status Tahun Ajaran" --> System
  System -- "Buat Data Tagihan (relasi ke santri, jenis, tahun ajaran)" --> DBTagihan
  System -- "Tampilkan Status Tambah Tagihan" --> Admin

  Admin -- "Edit Data Tagihan" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Update Data Tagihan" --> DBTagihan
  System -- "Tampilkan Status Edit Tagihan" --> Admin

  Admin -- "Hapus Data Tagihan" --> System
  System -- "Hapus Data Tagihan" --> DBTagihan
  System -- "Tampilkan Status Hapus Tagihan" --> Admin

  Admin -- "Input Data Jenis Tagihan" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Buat Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Tambah Jenis Tagihan" --> Admin

  Admin -- "Edit Data Jenis Tagihan" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Update Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Edit Jenis Tagihan" --> Admin

  Admin -- "Hapus Data Jenis Tagihan" --> System
  System -- "Hapus Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Hapus Jenis Tagihan" --> Admin
```

## Penjelasan
- **Tambah/Edit/Hapus Tagihan:** Melibatkan validasi data, cek santri, jenis tagihan, tahun ajaran, dan update ke tabel Tagihan.
- **Tambah/Edit/Hapus Jenis Tagihan:** Melibatkan validasi data dan update ke tabel JenisTagihan.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBTagihan[(Tabel Tagihan)]
  DBJenisTagihan[(Tabel JenisTagihan)]
  DBSantri[(Tabel Santri)]
  DBTahunAjaran[(Tabel TahunAjaran)]

  Admin -- "Input Data Tagihan" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Cek Santri & Jenis Tagihan Valid" --> DBSantri
  System -- "Cek Santri & Jenis Tagihan Valid" --> DBJenisTagihan
  System -- "Cek Tahun Ajaran Valid" --> DBTahunAjaran
  DBSantri -- "Status Santri" --> System
  DBJenisTagihan -- "Status Jenis Tagihan" --> System
  DBTahunAjaran -- "Status Tahun Ajaran" --> System
  System -- "Buat Data Tagihan (relasi ke santri, jenis, tahun ajaran)" --> DBTagihan
  System -- "Tampilkan Status Tambah Tagihan" --> Admin

  Admin -- "Edit Data Tagihan" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Update Data Tagihan" --> DBTagihan
  System -- "Tampilkan Status Edit Tagihan" --> Admin

  Admin -- "Hapus Data Tagihan" --> System
  System -- "Hapus Data Tagihan" --> DBTagihan
  System -- "Tampilkan Status Hapus Tagihan" --> Admin

  Admin -- "Input Data Jenis Tagihan" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Buat Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Tambah Jenis Tagihan" --> Admin

  Admin -- "Edit Data Jenis Tagihan" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Update Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Edit Jenis Tagihan" --> Admin

  Admin -- "Hapus Data Jenis Tagihan" --> System
  System -- "Hapus Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Status Hapus Jenis Tagihan" --> Admin
``` 