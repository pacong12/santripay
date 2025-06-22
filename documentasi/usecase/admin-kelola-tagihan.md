# Use Case Diagram — Admin: Kelola Tagihan

Diagram berikut menggambarkan skenario utama dalam proses kelola tagihan oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Buat Tagihan Individu)
  Admin --> (Buat Tagihan Massal)
  Admin --> (Edit Tagihan)
  Admin --> (Hapus Tagihan)
  Admin --> (Lihat Daftar Tagihan)
  (Buat Tagihan Individu) ..> (Validasi Data Tagihan) : include
  (Buat Tagihan Massal) ..> (Validasi Data Tagihan) : include
  (Edit Tagihan) ..> (Validasi Data Tagihan) : include
  (Hapus Tagihan) ..> (Konfirmasi Penghapusan) : include
```

## Penjelasan Use Case
- **Buat Tagihan Individu:** Admin membuat tagihan untuk satu santri.
- **Buat Tagihan Massal:** Admin membuat tagihan untuk banyak santri sekaligus (misal: per kelas).
- **Edit Tagihan:** Admin mengubah data tagihan yang sudah ada.
- **Hapus Tagihan:** Admin menghapus data tagihan dari sistem.
- **Lihat Daftar Tagihan:** Admin melihat/mencari daftar tagihan.

### Include:
- **Validasi Data Tagihan:** Proses validasi data saat membuat/edit tagihan.
- **Konfirmasi Penghapusan:** Konfirmasi sebelum menghapus data tagihan.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Buat Tagihan Individu)
  Admin --> (Buat Tagihan Massal)
  Admin --> (Edit Tagihan)
  Admin --> (Hapus Tagihan)
  Admin --> (Lihat Daftar Tagihan)
  (Buat Tagihan Individu) ..> (Validasi Data Tagihan) : include
  (Buat Tagihan Massal) ..> (Validasi Data Tagihan) : include
  (Edit Tagihan) ..> (Validasi Data Tagihan) : include
  (Hapus Tagihan) ..> (Konfirmasi Penghapusan) : include
``` 