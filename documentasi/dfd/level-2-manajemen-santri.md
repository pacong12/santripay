# DFD Level 2 — Manajemen Data Santri

Diagram berikut menggambarkan detail subproses pada manajemen data santri (contoh: tambah santri dan pindah kelas).

```mermaid
flowchart TD
  Admin((Admin))
  System([Santri Pay System])
  DBUser[(Tabel User)]
  DBSantri[(Tabel Santri)]
  DBKelas[(Tabel Kelas)]
  DBRiwayat[(Tabel RiwayatKelas)]

  Admin -- "Input Data Santri" --> System
  System -- "Validasi Username & Data" --> System
  System -- "Cek Username Unik" --> DBUser
  DBUser -- "Status Username" --> System
  System -- "Cek Kelas Valid" --> DBKelas
  DBKelas -- "Status Kelas" --> System
  System -- "Buat User (role: santri)" --> DBUser
  System -- "Buat Data Santri (relasi ke user & kelas)" --> DBSantri
  System -- "Tampilkan Status Tambah Santri" --> Admin

  Admin -- "Pindahkan Santri ke Kelas Lain" --> System
  System -- "Ambil Data Santri" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Ambil Data Kelas Tujuan" --> DBKelas
  DBKelas -- "Data Kelas" --> System
  System -- "Update kelasId di Santri" --> DBSantri
  System -- "Catat RiwayatKelas" --> DBRiwayat
  System -- "Tampilkan Status Pindah Kelas" --> Admin
```

## Penjelasan
- **Tambah Santri:** Melibatkan validasi username, cek kelas, pembuatan user & santri.
- **Pindah Kelas:** Melibatkan cek data santri, cek kelas tujuan, update kelasId, dan catat riwayat.

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

  Admin -- "Input Data Santri" --> System
  System -- "Validasi Username & Data" --> System
  System -- "Cek Username Unik" --> DBUser
  DBUser -- "Status Username" --> System
  System -- "Cek Kelas Valid" --> DBKelas
  DBKelas -- "Status Kelas" --> System
  System -- "Buat User (role: santri)" --> DBUser
  System -- "Buat Data Santri (relasi ke user & kelas)" --> DBSantri
  System -- "Tampilkan Status Tambah Santri" --> Admin

  Admin -- "Pindahkan Santri ke Kelas Lain" --> System
  System -- "Ambil Data Santri" --> DBSantri
  DBSantri -- "Data Santri" --> System
  System -- "Ambil Data Kelas Tujuan" --> DBKelas
  DBKelas -- "Data Kelas" --> System
  System -- "Update kelasId di Santri" --> DBSantri
  System -- "Catat RiwayatKelas" --> DBRiwayat
  System -- "Tampilkan Status Pindah Kelas" --> Admin
``` 