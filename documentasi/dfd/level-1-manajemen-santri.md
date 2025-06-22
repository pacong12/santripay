# DFD Level 1 — Manajemen Data Santri

Diagram berikut menggambarkan detail aliran data untuk proses manajemen data santri oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]
  DBKelas[(Tabel Kelas)]
  DBRiwayat[(Tabel RiwayatKelas)]

  Admin -- "Input Data Santri (username, nama, kelas, dsb)" --> System
  System -- "Validasi Data Santri" --> System
  System -- "Buat User (role: santri)" --> DBUser
  System -- "Buat Data Santri (relasi ke user & kelas)" --> DBSantri
  System -- "Update Data Santri" --> DBSantri
  System -- "Hapus Data Santri" --> DBSantri
  System -- "Ambil Data Kelas" --> DBKelas
  DBKelas -- "Data Kelas" --> System
  System -- "Tampilkan Data Santri & Kelas" --> Admin

  Admin -- "Pindahkan Santri ke Kelas Lain" --> System
  System -- "Update kelasId di Santri" --> DBSantri
  System -- "Catat RiwayatKelas (santriId, kelasLamaId, kelasBaruId, tanggal)" --> DBRiwayat
```

## Penjelasan
- **Admin** menginput, mengedit, menghapus, dan memindahkan santri.
- **System** melakukan validasi, update ke tabel User, Santri, Kelas, dan RiwayatKelas.
- **RiwayatKelas** mencatat perpindahan kelas santri.

---

### Kode Mermaid
```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]
  DBKelas[(Tabel Kelas)]
  DBRiwayat[(Tabel RiwayatKelas)]

  Admin -- "Input Data Santri (username, nama, kelas, dsb)" --> System
  System -- "Validasi Data Santri" --> System
  System -- "Buat User (role: santri)" --> DBUser
  System -- "Buat Data Santri (relasi ke user & kelas)" --> DBSantri
  System -- "Update Data Santri" --> DBSantri
  System -- "Hapus Data Santri" --> DBSantri
  System -- "Ambil Data Kelas" --> DBKelas
  DBKelas -- "Data Kelas" --> System
  System -- "Tampilkan Data Santri & Kelas" --> Admin

  Admin -- "Pindahkan Santri ke Kelas Lain" --> System
  System -- "Update kelasId di Santri" --> DBSantri
  System -- "Catat RiwayatKelas (santriId, kelasLamaId, kelasBaruId, tanggal)" --> DBRiwayat
``` 