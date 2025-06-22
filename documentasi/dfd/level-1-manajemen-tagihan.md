# DFD Level 1 — Manajemen Tagihan & Jenis Tagihan

Diagram berikut menggambarkan detail aliran data untuk proses manajemen tagihan dan jenis tagihan oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBTagihan[(Tabel Tagihan)]
  DBJenisTagihan[(Tabel JenisTagihan)]
  DBSantri[(Tabel Santri)]
  DBTahunAjaran[(Tabel TahunAjaran)]

  Admin -- "Input Data Tagihan (santri, jenis, nominal, due date, tahun ajaran)" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Buat Data Tagihan (relasi ke santri, jenis, tahun ajaran)" --> DBTagihan
  System -- "Update Data Tagihan" --> DBTagihan
  System -- "Hapus Data Tagihan" --> DBTagihan
  System -- "Ambil Data Santri" --> DBSantri
  System -- "Ambil Data JenisTagihan" --> DBJenisTagihan
  System -- "Ambil Data TahunAjaran" --> DBTahunAjaran
  DBSantri -- "Data Santri" --> System
  DBJenisTagihan -- "Data JenisTagihan" --> System
  DBTahunAjaran -- "Data TahunAjaran" --> System
  System -- "Tampilkan Data Tagihan" --> Admin

  Admin -- "Input Data Jenis Tagihan (nama, default nominal, deskripsi)" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Buat/Update/Hapus Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Data Jenis Tagihan" --> Admin
```

## Penjelasan
- **Admin** menginput, mengedit, menghapus tagihan dan jenis tagihan.
- **System** melakukan validasi, update ke tabel Tagihan, JenisTagihan, dan relasi ke Santri & TahunAjaran.

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

  Admin -- "Input Data Tagihan (santri, jenis, nominal, due date, tahun ajaran)" --> System
  System -- "Validasi Data Tagihan" --> System
  System -- "Buat Data Tagihan (relasi ke santri, jenis, tahun ajaran)" --> DBTagihan
  System -- "Update Data Tagihan" --> DBTagihan
  System -- "Hapus Data Tagihan" --> DBTagihan
  System -- "Ambil Data Santri" --> DBSantri
  System -- "Ambil Data JenisTagihan" --> DBJenisTagihan
  System -- "Ambil Data TahunAjaran" --> DBTahunAjaran
  DBSantri -- "Data Santri" --> System
  DBJenisTagihan -- "Data JenisTagihan" --> System
  DBTahunAjaran -- "Data TahunAjaran" --> System
  System -- "Tampilkan Data Tagihan" --> Admin

  Admin -- "Input Data Jenis Tagihan (nama, default nominal, deskripsi)" --> System
  System -- "Validasi Data Jenis Tagihan" --> System
  System -- "Buat/Update/Hapus Data Jenis Tagihan" --> DBJenisTagihan
  System -- "Tampilkan Data Jenis Tagihan" --> Admin
``` 