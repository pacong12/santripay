# Use Case Diagram — Santri: Login

Diagram berikut menggambarkan skenario utama dalam proses login oleh Santri pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Login)
  (Login) ..> (Input Username & Password) : include
  (Login) ..> (Validasi Kredensial) : include
  (Login) ..> (Tampilkan Error Jika Gagal) : extend
  (Login) ..> (Akses Dashboard Jika Berhasil) : extend
```

## Penjelasan Use Case
- **Login:** Santri melakukan login ke sistem menggunakan username dan password.

### Include:
- **Input Username & Password:** Santri mengisi form login.
- **Validasi Kredensial:** Sistem memeriksa kecocokan username dan password.

### Extend:
- **Tampilkan Error Jika Gagal:** Jika login gagal, sistem menampilkan pesan error.
- **Akses Dashboard Jika Berhasil:** Jika login berhasil, santri diarahkan ke dashboard.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Login)
  (Login) ..> (Input Username & Password) : include
  (Login) ..> (Validasi Kredensial) : include
  (Login) ..> (Tampilkan Error Jika Gagal) : extend
  (Login) ..> (Akses Dashboard Jika Berhasil) : extend
``` 