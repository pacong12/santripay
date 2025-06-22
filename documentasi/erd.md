# Entity Relationship Diagram (ERD) Santri Pay

Diagram berikut menggambarkan relasi utama antar tabel pada sistem Santri Pay.

```mermaid
erDiagram
  USERS ||--o| SANTRI : has
  USERS ||--o{ NOTIFIKASI : receives
  SANTRI ||--o{ TAGIHAN : owns
  SANTRI ||--o{ TRANSAKSI : makes
  SANTRI }o--|| KELAS : belongs
  SANTRI ||--o{ RIWAYAT_KELAS : has
  KELAS }o--|| TAHUN_AJARAN : in
  KELAS ||--o{ SANTRI : contains
  TAGIHAN }o--|| SANTRI : for
  TAGIHAN }o--|| JENIS_TAGIHAN : type
  TAGIHAN ||--o{ TRANSAKSI : paidBy
  TAGIHAN ||--o{ NOTIFIKASI : notifies
  TAGIHAN }o--|| TAHUN_AJARAN : in
  TRANSAKSI }o--|| SANTRI : by
  TRANSAKSI }o--|| TAGIHAN : for
  NOTIFIKASI }o--|| USERS : to
  NOTIFIKASI }o--|| TAGIHAN : about
  RIWAYAT_KELAS }o--|| SANTRI : for
  RIWAYAT_KELAS }o--|| KELAS : kelasLama
  RIWAYAT_KELAS }o--|| KELAS : kelasBaru

  USERS {
    string id PK
    string username
    string email
    string password
    enum role
  }
  SANTRI {
    string id PK
    string user_id FK
    string name
    string santri_id
    string kelas_id FK
  }
  KELAS {
    string id PK
    string name
    string tahun_ajaran_id FK
  }
  TAHUN_AJARAN {
    string id PK
    string name
  }
  TAGIHAN {
    string id PK
    string santri_id FK
    string jenis_tagihan_id FK
    string tahun_ajaran_id FK
  }
  JENIS_TAGIHAN {
    string id PK
    string name
  }
  TRANSAKSI {
    string id PK
    string santri_id FK
    string tagihan_id FK
  }
  NOTIFIKASI {
    string id PK
    string user_id FK
    string tagihan_id FK
  }
  RIWAYAT_KELAS {
    string id PK
    string santri_id FK
    string kelasLama_id FK
    string kelasBaru_id FK
  }
``` 