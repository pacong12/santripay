# Activity Diagram — Naik Kelas

Diagram berikut menggambarkan alur aktivitas pada proses kenaikan kelas santri oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  LihatSantri["Lihat daftar santri"]
  PilihSantri["Pilih santri yang akan naik kelas"]
  PilihKelasBaru["Pilih kelas baru"]
  ValidasiKelas["Validasi kelas baru"]
  KelasValid["Kelas valid?"]
  UpdateSantri["Update kelasId di data santri"]
  SimpanRiwayat["Simpan riwayat kenaikan kelas"]
  Sukses([Tampilkan status naik kelas berhasil])
  Gagal([Tampilkan error naik kelas])
  End([End])

  Start --> LihatSantri --> PilihSantri --> PilihKelasBaru --> ValidasiKelas --> KelasValid
  KelasValid -- Ya --> UpdateSantri --> SimpanRiwayat --> Sukses --> End
  KelasValid -- Tidak --> Gagal --> End
```

## Penjelasan
- Admin memilih santri & kelas baru, sistem validasi kelas.
- Jika valid, update kelasId di santri, simpan riwayat kenaikan kelas, tampilkan status berhasil. Jika tidak valid, tampilkan error.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  LihatSantri["Lihat daftar santri"]
  PilihSantri["Pilih santri yang akan naik kelas"]
  PilihKelasBaru["Pilih kelas baru"]
  ValidasiKelas["Validasi kelas baru"]
  KelasValid["Kelas valid?"]
  UpdateSantri["Update kelasId di data santri"]
  SimpanRiwayat["Simpan riwayat kenaikan kelas"]
  Sukses([Tampilkan status naik kelas berhasil])
  Gagal([Tampilkan error naik kelas])
  End([End])

  Start --> LihatSantri --> PilihSantri --> PilihKelasBaru --> ValidasiKelas --> KelasValid
  KelasValid -- Ya --> UpdateSantri --> SimpanRiwayat --> Sukses --> End
  KelasValid -- Tidak --> Gagal --> End
``` 