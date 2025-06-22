# Activity Diagram — Pengelolaan Tahun Ajaran

Diagram berikut menggambarkan alur aktivitas pada proses pengelolaan tahun ajaran oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatTA["Lihat daftar tahun ajaran"]
  PilihAksi{Aksi?}
  TambahTA["Input data tahun ajaran baru"]
  ValidasiTambah["Validasi data tahun ajaran"]
  SimpanTA["Simpan tahun ajaran ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditTA["Edit data tahun ajaran"]
  ValidasiEdit["Validasi data tahun ajaran"]
  UpdateTA["Update tahun ajaran di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusTA["Hapus tahun ajaran"]
  CekRelasi["Cek relasi ke kelas/tagihan"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteTA["Hapus tahun ajaran di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  SetAktif["Set tahun ajaran aktif"]
  UpdateAktif["Update status aktif di database"]
  SuksesAktif([Tampilkan status update berhasil])
  End([End])

  Start --> LihatTA --> PilihAksi
  PilihAksi -- Tambah --> TambahTA --> ValidasiTambah --> SimpanTA --> SuksesTambah --> End
  PilihAksi -- Edit --> EditTA --> ValidasiEdit --> UpdateTA --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusTA --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteTA --> SuksesHapus --> End
  PilihAksi -- SetAktif --> SetAktif --> UpdateAktif --> SuksesAktif --> End
```

## Penjelasan
- Admin dapat menambah, edit, hapus, dan set tahun ajaran aktif.
- Hapus tahun ajaran dicek relasinya ke kelas/tagihan, jika ada relasi tidak bisa dihapus.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatTA["Lihat daftar tahun ajaran"]
  PilihAksi{Aksi?}
  TambahTA["Input data tahun ajaran baru"]
  ValidasiTambah["Validasi data tahun ajaran"]
  SimpanTA["Simpan tahun ajaran ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditTA["Edit data tahun ajaran"]
  ValidasiEdit["Validasi data tahun ajaran"]
  UpdateTA["Update tahun ajaran di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusTA["Hapus tahun ajaran"]
  CekRelasi["Cek relasi ke kelas/tagihan"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteTA["Hapus tahun ajaran di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  SetAktif["Set tahun ajaran aktif"]
  UpdateAktif["Update status aktif di database"]
  SuksesAktif([Tampilkan status update berhasil])
  End([End])

  Start --> LihatTA --> PilihAksi
  PilihAksi -- Tambah --> TambahTA --> ValidasiTambah --> SimpanTA --> SuksesTambah --> End
  PilihAksi -- Edit --> EditTA --> ValidasiEdit --> UpdateTA --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusTA --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteTA --> SuksesHapus --> End
  PilihAksi -- SetAktif --> SetAktif --> UpdateAktif --> SuksesAktif --> End
``` 