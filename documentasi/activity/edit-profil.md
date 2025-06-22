# Activity Diagram — Edit Profil (Santri)

Diagram berikut menggambarkan alur aktivitas pada proses edit profil oleh Santri pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  InputProfil["Input data profil baru"]
  Validasi["Validasi data profil"]
  Valid["Data valid?"]
  UpdateUser["Update data user"]
  UpdateSantri["Update data santri"]
  Sukses([Tampilkan status update berhasil])
  Gagal([Tampilkan error update profil])
  End([End])

  Start --> InputProfil --> Validasi --> Valid
  Valid -- Ya --> UpdateUser --> UpdateSantri --> Sukses --> End
  Valid -- Tidak --> Gagal --> End
```

## Penjelasan
- Santri input data profil baru, sistem validasi data.
- Jika valid, update data user & santri, tampilkan status berhasil. Jika tidak valid, tampilkan error.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  InputProfil["Input data profil baru"]
  Validasi["Validasi data profil"]
  Valid["Data valid?"]
  UpdateUser["Update data user"]
  UpdateSantri["Update data santri"]
  Sukses([Tampilkan status update berhasil])
  Gagal([Tampilkan error update profil])
  End([End])

  Start --> InputProfil --> Validasi --> Valid
  Valid -- Ya --> UpdateUser --> UpdateSantri --> Sukses --> End
  Valid -- Tidak --> Gagal --> End
``` 