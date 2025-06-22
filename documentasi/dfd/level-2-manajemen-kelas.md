# DFD Level 2 — Manajemen Data Kelas

Diagram berikut menggambarkan detail subproses pada manajemen data kelas (tambah, edit, hapus, lihat daftar santri per kelas).

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBKelas[(Tabel Kelas)]
  DBTahunAjaran[(Tabel TahunAjaran)]
  DBSantri[(Tabel Santri)]

  Admin -- "Input Data Kelas" --> System
  System -- "Validasi Nama & Tahun Ajaran" --> System
  System -- "Cek Tahun Ajaran Valid" --> DBTahunAjaran
  DBTahunAjaran -- "Status Tahun Ajaran" --> System
  System -- "Buat Data Kelas (relasi ke tahun ajaran)" --> DBKelas
  System -- "Tampilkan Status Tambah Kelas" --> Admin

  Admin -- "Edit Data Kelas" --> System
  System -- "Validasi Data Kelas" --> System
  System -- "Update Data Kelas" --> DBKelas
  System -- "Tampilkan Status Edit Kelas" --> Admin

  Admin -- "Hapus Data Kelas" --> System
  System -- "Cek Kelas Digunakan Santri?" --> DBSantri
  DBSantri -- "Status Penggunaan" --> System
  System -- "Hapus Data Kelas" --> DBKelas
  System -- "Tampilkan Status Hapus Kelas" --> Admin

  Admin -- "Lihat Daftar Santri per Kelas" --> System
  System -- "Ambil Data Santri (kelasId)" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Daftar Santri" --> Admin
```

## Penjelasan
- **Tambah/Edit Kelas:** Melibatkan validasi nama & tahun ajaran, update ke tabel Kelas.
- **Hapus Kelas:** Cek apakah kelas digunakan oleh santri sebelum dihapus.
- **Lihat Daftar Santri:** Ambil data santri berdasarkan kelasId.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBKelas[(Tabel Kelas)]
  DBTahunAjaran[(Tabel TahunAjaran)]
  DBSantri[(Tabel Santri)]

  Admin -- "Input Data Kelas" --> System
  System -- "Validasi Nama & Tahun Ajaran" --> System
  System -- "Cek Tahun Ajaran Valid" --> DBTahunAjaran
  DBTahunAjaran -- "Status Tahun Ajaran" --> System
  System -- "Buat Data Kelas (relasi ke tahun ajaran)" --> DBKelas
  System -- "Tampilkan Status Tambah Kelas" --> Admin

  Admin -- "Edit Data Kelas" --> System
  System -- "Validasi Data Kelas" --> System
  System -- "Update Data Kelas" --> DBKelas
  System -- "Tampilkan Status Edit Kelas" --> Admin

  Admin -- "Hapus Data Kelas" --> System
  System -- "Cek Kelas Digunakan Santri?" --> DBSantri
  DBSantri -- "Status Penggunaan" --> System
  System -- "Hapus Data Kelas" --> DBKelas
  System -- "Tampilkan Status Hapus Kelas" --> Admin

  Admin -- "Lihat Daftar Santri per Kelas" --> System
  System -- "Ambil Data Santri (kelasId)" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Tampilkan Daftar Santri" --> Admin
``` 