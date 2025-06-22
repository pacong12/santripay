 # Use Case Diagram — Santri: Lihat & Edit Profil

Diagram berikut menggambarkan skenario utama dalam proses santri melihat dan mengedit profil pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Profil)
  Santri --> (Edit Profil)
  (Edit Profil) ..> (Validasi Data Profil) : include
  (Edit Profil) ..> (Tampilkan Error Jika Gagal) : extend
  (Edit Profil) ..> (Simpan Perubahan Jika Berhasil) : extend
```

## Penjelasan Use Case
- **Lihat Profil:** Santri melihat data profilnya (nama, nomor telepon, dsb).
- **Edit Profil:** Santri mengubah data profilnya.

### Include:
- **Validasi Data Profil:** Sistem memeriksa kelengkapan dan validitas data saat edit.

### Extend:
- **Tampilkan Error Jika Gagal:** Jika validasi gagal, sistem menampilkan pesan error.
- **Simpan Perubahan Jika Berhasil:** Jika validasi berhasil, perubahan disimpan.

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Lihat Profil)
  Santri --> (Edit Profil)
  (Edit Profil) ..> (Validasi Data Profil) : include
  (Edit Profil) ..> (Tampilkan Error Jika Gagal) : extend
  (Edit Profil) ..> (Simpan Perubahan Jika Berhasil) : extend
```
