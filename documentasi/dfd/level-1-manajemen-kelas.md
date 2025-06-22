# DFD Level 1 — Manajemen Data Kelas

Diagram berikut menggambarkan detail aliran data untuk proses manajemen data kelas oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBKelas[(Tabel Kelas)]
  DBTahunAjaran[(Tabel TahunAjaran)]
  DBSantri[(Tabel Santri)]

  Admin -- "Input Data Kelas (nama, level, tahun ajaran)" --> System
  System -- "Validasi Data Kelas" --> System
  System -- "Buat Data Kelas (relasi ke tahun ajaran)" --> DBKelas
  System -- "Update Data Kelas" --> DBKelas
  System -- "Hapus Data Kelas" --> DBKelas
  System -- "Ambil Data TahunAjaran" --> DBTahunAjaran
  DBTahunAjaran -- "Data TahunAjaran" --> System
  System -- "Tampilkan Data Kelas & TahunAjaran" --> Admin

  Admin -- "Lihat Daftar Santri per Kelas" --> System
  System -- "Ambil Data Santri (kelasId)" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Daftar Santri" --> Admin
```

## Penjelasan
- **Admin** menginput, mengedit, menghapus, dan melihat data kelas.
- **System** melakukan validasi, update ke tabel Kelas, relasi ke TahunAjaran, dan menampilkan daftar santri per kelas.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBKelas[(Tabel Kelas)]
  DBTahunAjaran[(Tabel TahunAjaran)]
  DBSantri[(Tabel Santri)]

  Admin -- "Input Data Kelas (nama, level, tahun ajaran)" --> System
  System -- "Validasi Data Kelas" --> System
  System -- "Buat Data Kelas (relasi ke tahun ajaran)" --> DBKelas
  System -- "Update Data Kelas" --> DBKelas
  System -- "Hapus Data Kelas" --> DBKelas
  System -- "Ambil Data TahunAjaran" --> DBTahunAjaran
  DBTahunAjaran -- "Data TahunAjaran" --> System
  System -- "Tampilkan Data Kelas & TahunAjaran" --> Admin

  Admin -- "Lihat Daftar Santri per Kelas" --> System
  System -- "Ambil Data Santri (kelasId)" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Daftar Santri" --> Admin
``` 