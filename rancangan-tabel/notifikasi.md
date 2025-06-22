| No | Nama Kolom   | Tipe Data | Panjang | Keterangan |
|----|--------------|-----------|---------|-----------------|
| 1  | _id_         | integer   | 11      | Primary key     |
| 2  | user_id      | integer   | 11      | Foreign key     |
| 3  | title        | varchar   | 100     | Not null        |
| 4  | message      | text      | -       | Not null        |
| 5  | type         | enum      | -       | Not null        |
| 6  | is_read      | boolean   | -       | Not null, default false |
| 7  | role         | enum      | -       | Not null, default 'santri' |
| 8  | tagihan_id   | integer   | 11      | Foreign key, Nullable |
| 9  | created_at   | datetime  | -       | Not null        | 