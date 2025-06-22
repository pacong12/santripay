| No | Nama Kolom     | Tipe Data | Panjang | Keterangan                |
|----|----------------|-----------|---------|---------------------------|
| 1  | _id_           | integer   | 11      | Primary key               |
| 2  | santri_id      | integer   | 11      | Foreign key               |
| 3  | kelasLama_id   | integer   | 11      | Foreign key (kelas lama)  |
| 4  | kelasBaru_id   | integer   | 11      | Foreign key (kelas baru)  |
| 5  | tanggal        | datetime  | -       | Not null, default now()   | 