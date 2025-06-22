# Activity Diagram — Pengelolaan Kelas

Diagram berikut menggambarkan alur aktivitas pada proses pengelolaan kelas oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatKelas["Lihat daftar kelas"]
  PilihAksi{Aksi?}
  TambahKelas["Input data kelas baru"]
  ValidasiTambah["Validasi data kelas"]
  SimpanKelas["Simpan kelas ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditKelas["Edit data kelas"]
  ValidasiEdit["Validasi data kelas"]
  UpdateKelas["Update kelas di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusKelas["Hapus kelas"]
  CekRelasi["Cek relasi ke santri/riwayat"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteKelas["Hapus kelas di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatKelas --> PilihAksi
  PilihAksi -- Tambah --> TambahKelas --> ValidasiTambah --> SimpanKelas --> SuksesTambah --> End
  PilihAksi -- Edit --> EditKelas --> ValidasiEdit --> UpdateKelas --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusKelas --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteKelas --> SuksesHapus --> End
```

## Penjelasan
- Admin dapat menambah, edit, hapus kelas.
- Hapus kelas dicek relasinya ke santri/riwayat, jika ada relasi tidak bisa dihapus.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatKelas["Lihat daftar kelas"]
  PilihAksi{Aksi?}
  TambahKelas["Input data kelas baru"]
  ValidasiTambah["Validasi data kelas"]
  SimpanKelas["Simpan kelas ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditKelas["Edit data kelas"]
  ValidasiEdit["Validasi data kelas"]
  UpdateKelas["Update kelas di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusKelas["Hapus kelas"]
  CekRelasi["Cek relasi ke santri/riwayat"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteKelas["Hapus kelas di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatKelas --> PilihAksi
  PilihAksi -- Tambah --> TambahKelas --> ValidasiTambah --> SimpanKelas --> SuksesTambah --> End
  PilihAksi -- Edit --> EditKelas --> ValidasiEdit --> UpdateKelas --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusKelas --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteKelas --> SuksesHapus --> End
``` 