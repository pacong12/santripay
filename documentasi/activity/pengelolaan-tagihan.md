# Activity Diagram — Pengelolaan Tagihan

Diagram berikut menggambarkan alur aktivitas pada proses pengelolaan tagihan oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatTagihan["Lihat daftar tagihan"]
  PilihAksi{Aksi?}
  TambahTagihan["Input data tagihan baru"]
  ValidasiTambah["Validasi data tagihan"]
  SimpanTagihan["Simpan tagihan ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditTagihan["Edit data tagihan"]
  ValidasiEdit["Validasi data tagihan"]
  UpdateTagihan["Update tagihan di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusTagihan["Hapus tagihan"]
  CekRelasi["Cek relasi ke transaksi"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteTagihan["Hapus tagihan di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatTagihan --> PilihAksi
  PilihAksi -- Tambah --> TambahTagihan --> ValidasiTambah --> SimpanTagihan --> SuksesTambah --> End
  PilihAksi -- Edit --> EditTagihan --> ValidasiEdit --> UpdateTagihan --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusTagihan --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteTagihan --> SuksesHapus --> End
```

## Penjelasan
- Admin dapat menambah, edit, hapus tagihan.
- Hapus tagihan dicek relasinya ke transaksi, jika ada relasi tidak bisa dihapus.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatTagihan["Lihat daftar tagihan"]
  PilihAksi{Aksi?}
  TambahTagihan["Input data tagihan baru"]
  ValidasiTambah["Validasi data tagihan"]
  SimpanTagihan["Simpan tagihan ke database"]
  SuksesTambah([Tampilkan status tambah berhasil])
  EditTagihan["Edit data tagihan"]
  ValidasiEdit["Validasi data tagihan"]
  UpdateTagihan["Update tagihan di database"]
  SuksesEdit([Tampilkan status edit berhasil])
  HapusTagihan["Hapus tagihan"]
  CekRelasi["Cek relasi ke transaksi"]
  RelasiAda{Ada relasi?}
  GagalHapus([Tampilkan error tidak bisa hapus])
  DeleteTagihan["Hapus tagihan di database"]
  SuksesHapus([Tampilkan status hapus berhasil])
  End([End])

  Start --> LihatTagihan --> PilihAksi
  PilihAksi -- Tambah --> TambahTagihan --> ValidasiTambah --> SimpanTagihan --> SuksesTambah --> End
  PilihAksi -- Edit --> EditTagihan --> ValidasiEdit --> UpdateTagihan --> SuksesEdit --> End
  PilihAksi -- Hapus --> HapusTagihan --> CekRelasi --> RelasiAda
  RelasiAda -- Ya --> GagalHapus --> End
  RelasiAda -- Tidak --> DeleteTagihan --> SuksesHapus --> End
``` 