| No | Nama Kolom   | Tipe Data | Panjang | Keterangan                        |
|----|--------------|-----------|---------|------------------------------------|
| 1  | _id_         | integer   | 11      | Primary key                        |
| 2  | santri_id    | integer   | 11      | Foreign key                        |
| 3  | tagihan_id   | integer   | 11      | Foreign key, Nullable              |
| 4  | amount       | bigint    | -       | Not null                           |
| 5  | status       | enum('pending','approved','rejected') | - | Not null, default 'pending' |
| 6  | payment_date | datetime  | -       | Not null                           |
| 7  | note         | text      | -       | Nullable (alasan penolakan, dsb)   | 