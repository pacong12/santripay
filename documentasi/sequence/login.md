# Sequence Diagram — Login (Santri/Admin)

Diagram berikut menggambarkan urutan interaksi pada proses login oleh Santri/Admin pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant User as Santri/Admin
  participant UI as Frontend (Login Page)
  participant API as Backend API
  participant DB as Database

  User->>UI: Input username & password
  UI->>API: Kirim request login (username, password)
  API->>DB: Cek user by username
  DB-->>API: Data user (jika ada)
  API->>API: Verifikasi password (bcrypt)
  API->>DB: Ambil data profil (Santri/Admin)
  DB-->>API: Data profil
  alt Login sukses
    API-->>UI: Kirim token/session & data profil
    UI-->>User: Redirect ke dashboard
  else Login gagal
    API-->>UI: Kirim error (invalid credentials)
    UI-->>User: Tampilkan pesan error
  end
```

## Penjelasan
- User mengisi form login, frontend mengirim ke backend.
- Backend cek user, verifikasi password, ambil data profil.
- Jika sukses, kirim session/token dan redirect ke dashboard. Jika gagal, tampilkan error.

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant User as Santri/Admin
  participant UI as Frontend (Login Page)
  participant API as Backend API
  participant DB as Database

  User->>UI: Input username & password
  UI->>API: Kirim request login (username, password)
  API->>DB: Cek user by username
  DB-->>API: Data user (jika ada)
  API->>API: Verifikasi password (bcrypt)
  API->>DB: Ambil data profil (Santri/Admin)
  DB-->>API: Data profil
  alt Login sukses
    API-->>UI: Kirim token/session & data profil
    UI-->>User: Redirect ke dashboard
  else Login gagal
    API-->>UI: Kirim error (invalid credentials)
    UI-->>User: Tampilkan pesan error
  end
``` 