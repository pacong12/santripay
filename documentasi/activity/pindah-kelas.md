# Activity Diagram — Pindah Kelas (Admin)

Diagram berikut menggambarkan alur aktivitas pada proses pindah kelas santri oleh Admin pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  PilihSantri["Pilih santri yang akan dipindah"]
  PilihKelasBaru["Pilih kelas baru"]
  ValidasiKelas["Validasi kelas baru"]
  KelasValid["Kelas valid?"]
  UpdateSantri["Update kelasId di data santri"]
  SimpanRiwayat["Simpan riwayat perpindahan kelas"]
  Sukses([Tampilkan status pindah kelas berhasil])
  Gagal([Tampilkan error pindah kelas])
  End([End])

  Start --> PilihSantri --> PilihKelasBaru --> ValidasiKelas --> KelasValid
  KelasValid -- Ya --> UpdateSantri --> SimpanRiwayat --> Sukses --> End
  KelasValid -- Tidak --> Gagal --> End
```

## Penjelasan
- Admin memilih santri & kelas baru, sistem validasi kelas.
- Jika valid, update kelasId di santri, simpan riwayat, tampilkan status berhasil. Jika tidak valid, tampilkan error.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  PilihSantri["Pilih santri yang akan dipindah"]
  PilihKelasBaru["Pilih kelas baru"]
  ValidasiKelas["Validasi kelas baru"]
  KelasValid["Kelas valid?"]
  UpdateSantri["Update kelasId di data santri"]
  SimpanRiwayat["Simpan riwayat perpindahan kelas"]
  Sukses([Tampilkan status pindah kelas berhasil])
  Gagal([Tampilkan error pindah kelas])
  End([End])

  Start --> PilihSantri --> PilihKelasBaru --> ValidasiKelas --> KelasValid
  KelasValid -- Ya --> UpdateSantri --> SimpanRiwayat --> Sukses --> End
  KelasValid -- Tidak --> Gagal --> End
``` 