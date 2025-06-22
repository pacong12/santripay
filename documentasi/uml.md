# UML Class Diagram Santri Pay

Diagram berikut menggambarkan struktur utama database dan relasi antar entitas pada sistem Santri Pay.

```mermaid
classDiagram
  class User {
    +String id
    +String username
    +String email
    +String password
    +Role role
    +Boolean receiveAppNotifications
    +Boolean receiveEmailNotifications
    +DateTime createdAt
    +DateTime updatedAt
  }
  class Santri {
    +String id
    +String userId
    +String name
    +String santriId
    +String kelasId
    +String? phone
    +DateTime createdAt
    +DateTime updatedAt
  }
  class Kelas {
    +String id
    +String name
    +String? level
    +String tahunAjaranId
    +DateTime createdAt
    +DateTime updatedAt
  }
  class TahunAjaran {
    +String id
    +String name
    +Boolean aktif
    +DateTime createdAt
    +DateTime updatedAt
  }
  class Tagihan {
    +String id
    +String santriId
    +String jenisTagihanId
    +BigInt amount
    +StatusTagihan status
    +DateTime dueDate
    +String? description
    +String? tahunAjaranId
    +DateTime createdAt
    +DateTime updatedAt
  }
  class JenisTagihan {
    +String id
    +String name
    +BigInt? amount
    +String? description
    +DateTime createdAt
    +DateTime updatedAt
  }
  class Transaksi {
    +String id
    +String santriId
    +String? tagihanId
    +BigInt amount
    +StatusTransaksi status
    +DateTime paymentDate
    +String? note
    +DateTime createdAt
    +DateTime updatedAt
  }
  class Notifikasi {
    +String id
    +String userId
    +String title
    +String message
    +JenisNotifikasi type
    +Boolean isRead
    +Role role
    +String? tagihanId
    +DateTime createdAt
    +DateTime updatedAt
  }
  class RiwayatKelas {
    +String id
    +String santriId
    +String kelasLamaId
    +String kelasBaruId
    +DateTime tanggal
  }

  User "1" --o "1" Santri : has
  User "1" --o "*" Notifikasi : receives
  Santri "1" --o "*" Tagihan : owns
  Santri "1" --o "*" Transaksi : makes
  Santri "*" --o "1" Kelas : belongs
  Santri "1" --o "*" RiwayatKelas : has
  Kelas "*" --o "1" TahunAjaran : in
  Kelas "1" --o "*" Santri : contains
  Tagihan "*" --o "1" Santri : for
  Tagihan "*" --o "1" JenisTagihan : type
  Tagihan "1" --o "*" Transaksi : paidBy
  Tagihan "1" --o "*" Notifikasi : notifies
  Tagihan "*" --o "1" TahunAjaran : in
  Transaksi "*" --o "1" Santri : by
  Transaksi "*" --o "1" Tagihan : for
  Notifikasi "*" --o "1" User : to
  Notifikasi "*" --o "1" Tagihan : about
  RiwayatKelas "*" --o "1" Santri : for
  RiwayatKelas "*" --o "1" Kelas : kelasLama
  RiwayatKelas "*" --o "1" Kelas : kelasBaru
```

## Penjelasan Relasi Utama
- **User ↔ Santri:** Satu user (role santri) memiliki satu data santri.
- **Santri ↔ Kelas:** Santri tergabung dalam satu kelas, satu kelas berisi banyak santri.
- **Santri ↔ Tagihan/Transaksi:** Satu santri bisa memiliki banyak tagihan dan transaksi.
- **Tagihan ↔ JenisTagihan:** Setiap tagihan punya satu jenis (kategori).
- **Tagihan ↔ Transaksi:** Satu tagihan bisa dibayar lewat beberapa transaksi.
- **Notifikasi:** Dikirim ke user, bisa terkait tagihan.
- **RiwayatKelas:** Mencatat perpindahan kelas santri.

> Diagram ini dapat divisualisasikan dengan Mermaid Live Editor atau tools serupa. 