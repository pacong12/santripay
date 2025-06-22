# Use Case Diagram — Admin: Kelola Kelas

Diagram berikut menggambarkan skenario utama dalam proses kelola kelas oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Kelas)
  Admin --> (Edit Kelas)
  Admin --> (Hapus Kelas)
  Admin --> (Lihat Daftar Kelas)
  (Tambah Kelas) ..> (Validasi Data Kelas) : include
  (Edit Kelas) ..> (Validasi Data Kelas) : include
  (Hapus Kelas) ..> (Konfirmasi Penghapusan) : include
```

## Penjelasan Use Case
- **Tambah Kelas:** Admin menambah data kelas baru ke sistem.
- **Edit Kelas:** Admin mengubah data kelas yang sudah ada.
- **Hapus Kelas:** Admin menghapus data kelas dari sistem.
- **Lihat Daftar Kelas:** Admin melihat/mencari daftar kelas.

### Include:
- **Validasi Data Kelas:** Proses validasi data saat tambah/edit kelas.
- **Konfirmasi Penghapusan:** Konfirmasi sebelum menghapus data kelas.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Kelas)
  Admin --> (Edit Kelas)
  Admin --> (Hapus Kelas)
  Admin --> (Lihat Daftar Kelas)
  (Tambah Kelas) ..> (Validasi Data Kelas) : include
  (Edit Kelas) ..> (Validasi Data Kelas) : include
  (Hapus Kelas) ..> (Konfirmasi Penghapusan) : include
``` 