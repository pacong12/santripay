# Use Case Diagram — Admin: Kelola Santri

Diagram berikut menggambarkan skenario utama dalam proses kelola santri oleh Admin pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Santri)
  Admin --> (Edit Santri)
  Admin --> (Hapus Santri)
  Admin --> (Pindahkan Santri ke Kelas Lain)
  Admin --> (Lihat Daftar Santri)
  (Tambah Santri) ..> (Validasi Data Santri) : include
  (Edit Santri) ..> (Validasi Data Santri) : include
  (Hapus Santri) ..> (Konfirmasi Penghapusan) : include
  (Pindahkan Santri ke Kelas Lain) ..> (Validasi Kelas Tujuan) : include
```

## Penjelasan Use Case
- **Tambah Santri:** Admin menambah data santri baru ke sistem.
- **Edit Santri:** Admin mengubah data santri yang sudah ada.
- **Hapus Santri:** Admin menghapus data santri dari sistem.
- **Pindahkan Santri ke Kelas Lain:** Admin memindahkan santri ke kelas lain.
- **Lihat Daftar Santri:** Admin melihat/mencari daftar santri.

### Include:
- **Validasi Data Santri:** Proses validasi data saat tambah/edit.
- **Konfirmasi Penghapusan:** Konfirmasi sebelum menghapus data.
- **Validasi Kelas Tujuan:** Memastikan kelas tujuan valid saat pindah kelas.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Admin" as Admin
  Admin --> (Tambah Santri)
  Admin --> (Edit Santri)
  Admin --> (Hapus Santri)
  Admin --> (Pindahkan Santri ke Kelas Lain)
  Admin --> (Lihat Daftar Santri)
  (Tambah Santri) ..> (Validasi Data Santri) : include
  (Edit Santri) ..> (Validasi Data Santri) : include
  (Hapus Santri) ..> (Konfirmasi Penghapusan) : include
  (Pindahkan Santri ke Kelas Lain) ..> (Validasi Kelas Tujuan) : include
```

</rewritten_file> 