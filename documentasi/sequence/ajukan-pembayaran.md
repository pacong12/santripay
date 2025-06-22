# Sequence Diagram — Ajukan Pembayaran (Santri)

Diagram berikut menggambarkan urutan interaksi pada proses santri mengajukan pembayaran tagihan pada sistem Santri Pay.

```mermaid
sequenceDiagram
  participant Santri as Santri
  participant UI as Frontend (Pembayaran Page)
  participant API as Backend API
  participant DB as Database

  Santri->>UI: Pilih tagihan & input nominal/bukti
  UI->>API: Kirim request pembayaran (tagihan, nominal, bukti)
  API->>DB: Cek tagihan & status
  DB-->>API: Data tagihan
  API->>API: Validasi data pembayaran
  API->>DB: Simpan transaksi (status: pending)
  API->>DB: Update status tagihan (pending)
  API-->>UI: Kirim status pengajuan (berhasil/gagal)
  UI-->>Santri: Tampilkan status pengajuan
```

## Penjelasan
- Santri memilih tagihan, mengisi nominal/bukti, frontend mengirim ke backend.
- Backend cek tagihan, validasi data, simpan transaksi, update status tagihan.
- Status pengajuan dikirim ke santri.

---

### Kode Mermaid
```mermaid
sequenceDiagram
  participant Santri as Santri
  participant UI as Frontend (Pembayaran Page)
  participant API as Backend API
  participant DB as Database

  Santri->>UI: Pilih tagihan & input nominal/bukti
  UI->>API: Kirim request pembayaran (tagihan, nominal, bukti)
  API->>DB: Cek tagihan & status
  DB-->>API: Data tagihan
  API->>API: Validasi data pembayaran
  API->>DB: Simpan transaksi (status: pending)
  API->>DB: Update status tagihan (pending)
  API-->>UI: Kirim status pengajuan (berhasil/gagal)
  UI-->>Santri: Tampilkan status pengajuan
``` 