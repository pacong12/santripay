| No | Nama Kolom | Tipe Data | Panjang | Keterangan |
|----|---------------|-----------|---------|-----------------|
| 1  | _santri_id_   | integer   | 11      | Primary key     |
| 2  | user_id       | integer   | 11      | Foreign key     |
| 3  | kelas_id      | integer   | 11      | Foreign key     |
| 4  | nama_santri   | varchar   | 100     | Not null        |
| 5  | nis           | varchar   | 20      | Not null, Unique|
| 6  | telepon       | varchar   | 15      | Nullable        | 