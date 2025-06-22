# Activity Diagram — Ajukan Pembayaran (Santri)

Diagram berikut menggambarkan alur aktivitas pada proses santri mengajukan pembayaran tagihan pada sistem Santri Pay.

```mermaid
flowchart TD
  Start([Start])
  PilihTagihan["Pilih tagihan"]
  InputNominal["Input nominal & upload bukti (jika perlu)"]
  Validasi["Validasi data pembayaran"]
  Valid["Data valid?"]
  SimpanTransaksi["Simpan transaksi (pending)"]
  UpdateTagihan["Update status tagihan (pending)"]
  Sukses([Tampilkan status pengajuan berhasil])
  Gagal([Tampilkan error pengajuan])
  End([End])

  Start --> PilihTagihan --> InputNominal --> Validasi --> Valid
  Valid -- Ya --> SimpanTransaksi --> UpdateTagihan --> Sukses --> End
  Valid -- Tidak --> Gagal --> End
```

## Penjelasan
- Santri memilih tagihan, input nominal/bukti, sistem validasi data.
- Jika valid, simpan transaksi & update status tagihan, tampilkan status berhasil. Jika tidak valid, tampilkan error.

---

### Kode Mermaid
```mermaid
flowchart TD
  Start([Start])
  PilihTagihan["Pilih tagihan"]
  InputNominal["Input nominal & upload bukti (jika perlu)"]
  Validasi["Validasi data pembayaran"]
  Valid["Data valid?"]
  SimpanTransaksi["Simpan transaksi (pending)"]
  UpdateTagihan["Update status tagihan (pending)"]
  Sukses([Tampilkan status pengajuan berhasil])
  Gagal([Tampilkan error pengajuan])
  End([End])

  Start --> PilihTagihan --> InputNominal --> Validasi --> Valid
  Valid -- Ya --> SimpanTransaksi --> UpdateTagihan --> Sukses --> End
  Valid -- Tidak --> Gagal --> End
``` 