# Activity Diagram — Pengelolaan Santri

Diagram berikut menggambarkan alur aktivitas pada proses pengelolaan santri oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatSantri["Lihat daftar santri"]
  PilihAksi{Aksi?}
  TambahSantri["Input data santri baru"]
  ValidasiTambah["Validasi data santri"]
  SimpanUser["Simpan user (role: santri)"]
  SimpanSantri["Simpan santri ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditSantri["Edit data santri"]
  ValidasiEdit["Validasi data santri"]
  UpdateSantri["Update santri di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusSantri["Hapus santri"]
  CekRelasi["Cek relasi ke tagihan/transaksi"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteSantri["Hapus santri di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatSantri --> PilihAksi
  PilihAksi -- Tambah --> TambahSantri --> ValidasiTambah --> SimpanUser --> SimpanSantri --> SuksesTambah --> End
  PilihAksi -- Edit --> EditSantri --> ValidasiEdit --> UpdateSantri --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusSantri --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteSantri --> SuksesHapus --> End
```

## Penjelasan
- Admin dapat menambah, edit, hapus santri.
- Hapus santri dicek relasinya ke tagihan/transaksi, jika ada relasi tidak bisa dihapus.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatSantri["Lihat daftar santri"]
  PilihAksi{Aksi?}
  TambahSantri["Input data santri baru"]
  ValidasiTambah["Validasi data santri"]
  SimpanUser["Simpan user (role: santri)"]
  SimpanSantri["Simpan santri ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditSantri["Edit data santri"]
  ValidasiEdit["Validasi data santri"]
  UpdateSantri["Update santri di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusSantri["Hapus santri"]
  CekRelasi["Cek relasi ke tagihan/transaksi"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteSantri["Hapus santri di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatSantri --> PilihAksi
  PilihAksi -- Tambah --> TambahSantri --> ValidasiTambah --> SimpanUser --> SimpanSantri --> SuksesTambah --> End
  PilihAksi -- Edit --> EditSantri --> ValidasiEdit --> UpdateSantri --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusSantri --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteSantri --> SuksesHapus --> End
``` 