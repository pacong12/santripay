# Activity Diagram — Login

Diagram berikut menggambarkan alur aktivitas pada proses login (Santri/Admin) pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  Input["Input username & password"]
  Validasi["Validasi form input"]
  Kirim["Kirim request login ke backend"]
  CekUser["Cek user by username di database"]
  UserAda{User ditemukan?}
  VerifPass["Verifikasi password (bcrypt)"]
  PassBenar{Password benar?}
  AmbilProfil["Ambil data profil"]
  Sukses([Login sukses, redirect ke dashboard])
  Gagal([Tampilkan error login])
  End([End])

  Start --> Input --> Validasi --> Kirim --> CekUser
  CekUser -- Ya --> VerifPass
  CekUser -- Tidak --> Gagal --> End
  VerifPass -- Ya --> AmbilProfil --> Sukses --> End
  VerifPass -- Tidak --> Gagal --> End
```

## Penjelasan
- User mengisi form login, sistem validasi input, cek user di database, verifikasi password.
- Jika sukses, ambil profil dan redirect ke dashboard. Jika gagal, tampilkan error.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  Input["Input username & password"]
  Validasi["Validasi form input"]
  Kirim["Kirim request login ke backend"]
  CekUser["Cek user by username di database"]
  UserAda{User ditemukan?}
  VerifPass["Verifikasi password (bcrypt)"]
  PassBenar{Password benar?}
  AmbilProfil["Ambil data profil"]
  Sukses([Login sukses, redirect ke dashboard])
  Gagal([Tampilkan error login])
  End([End])

  Start --> Input --> Validasi --> Kirim --> CekUser
  CekUser -- Ya --> VerifPass
  CekUser -- Tidak --> Gagal --> End
  VerifPass -- Ya --> AmbilProfil --> Sukses --> End
  VerifPass -- Tidak --> Gagal --> End
``` 