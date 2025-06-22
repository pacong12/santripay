# Use Case Diagram — Admin: Kelola Jenis Tagihan

Diagram berikut menggambarkan skenario utama dalam proses kelola jenis tagihan oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Jenis Tagihan)
  Admin --> (Edit Jenis Tagihan)
  Admin --> (Hapus Jenis Tagihan)
  Admin --> (Lihat Daftar Jenis Tagihan)
  (Tambah Jenis Tagihan) ..> (Validasi Data Jenis Tagihan) : include
  (Edit Jenis Tagihan) ..> (Validasi Data Jenis Tagihan) : include
  (Hapus Jenis Tagihan) ..> (Konfirmasi Penghapusan) : include
```

## Penjelasan Use Case
- **Tambah Jenis Tagihan:** Admin menambah kategori/tagihan baru ke sistem.
- **Edit Jenis Tagihan:** Admin mengubah data jenis tagihan yang sudah ada.
- **Hapus Jenis Tagihan:** Admin menghapus data jenis tagihan dari sistem.
- **Lihat Daftar Jenis Tagihan:** Admin melihat/mencari daftar jenis tagihan.

### Include:
- **Validasi Data Jenis Tagihan:** Proses validasi data saat tambah/edit jenis tagihan.
- **Konfirmasi Penghapusan:** Konfirmasi sebelum menghapus data jenis tagihan.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Jenis Tagihan)
  Admin --> (Edit Jenis Tagihan)
  Admin --> (Hapus Jenis Tagihan)
  Admin --> (Lihat Daftar Jenis Tagihan)
  (Tambah Jenis Tagihan) ..> (Validasi Data Jenis Tagihan) : include
  (Edit Jenis Tagihan) ..> (Validasi Data Jenis Tagihan) : include
  (Hapus Jenis Tagihan) ..> (Konfirmasi Penghapusan) : include
```

</rewritten_file> 