# Use Case Diagram — Santri: Ajukan Pembayaran

Diagram berikut menggambarkan skenario utama dalam proses santri mengajukan pembayaran pada sistem Santri Pay.

```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Ajukan Pembayaran)
  (Ajukan Pembayaran) ..> (Pilih Tagihan) : include
  (Ajukan Pembayaran) ..> (Input Nominal Pembayaran) : include
  (Ajukan Pembayaran) ..> (Upload Bukti Pembayaran) : include
  (Ajukan Pembayaran) ..> (Validasi Data Pembayaran) : include
  (Ajukan Pembayaran) ..> (Tampilkan Status Pengajuan) : extend
```

## Penjelasan Use Case
- **Ajukan Pembayaran:** Santri mengajukan pembayaran untuk tagihan tertentu atau pembayaran ad-hoc.

### Include:
- **Pilih Tagihan:** Santri memilih tagihan yang ingin dibayar.
- **Input Nominal Pembayaran:** Santri mengisi jumlah pembayaran (jika ad-hoc).
- **Upload Bukti Pembayaran:** Santri mengunggah bukti transfer (jika diperlukan).
- **Validasi Data Pembayaran:** Sistem memeriksa kelengkapan data pembayaran.

### Extend:
- **Tampilkan Status Pengajuan:** Sistem menampilkan status pengajuan setelah submit (pending/berhasil/gagal).

---

### Kode Mermaid
```mermaid
usecaseDiagram
  actor "Santri" as Santri
  Santri --> (Ajukan Pembayaran)
  (Ajukan Pembayaran) ..> (Pilih Tagihan) : include
  (Ajukan Pembayaran) ..> (Input Nominal Pembayaran) : include
  (Ajukan Pembayaran) ..> (Upload Bukti Pembayaran) : include
  (Ajukan Pembayaran) ..> (Validasi Data Pembayaran) : include
  (Ajukan Pembayaran) ..> (Tampilkan Status Pengajuan) : extend
``` 