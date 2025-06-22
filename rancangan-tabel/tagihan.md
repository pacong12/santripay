| No | Nama Kolom | Tipe Data | Panjang | Keterangan |
|----|--------------------|--------------------------------|---------|---------------------------|
| 1  | _id_               | integer                        | 11      | Primary key               |
| 2  | santri_id          | integer                        | 11      | Foreign key               |
| 3  | jenis_tagihan_id   | integer                        | 11      | Foreign key               |
| 4  | tahun_ajaran_id    | integer                        | 11      | Foreign key, Nullable     |
| 5  | amount             | bigint                         | -       | Not null                  |
| 6  | status             | enum('pending','paid','overdue')| -       | Not null, default 'pending'|
| 7  | due_date           | datetime                       | -       | Not null                  |
| 8  | description        | text                           | -       | Nullable                  | 