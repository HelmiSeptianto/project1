# Feature Implementation Plan: User Registration & Users Table

## 1. Ringkasan Fitur
Implementasi endpoint registrasi pengguna baru (`POST /api/users`) dengan penyimpanan data ke database MySQL menggunakan **Drizzle ORM**, password hashing berbasis **bcrypt**, dan framework **ElysiaJS**.

Dokumen ini disusun sebagai panduan langkah-demi-langkah yang jelas, terstruktur, dan mudah dieksekusi oleh junior programmer atau model AI pelaksana.

---

## 2. Struktur Direktori & Konvensi File
Pastikan kode diletakkan pada folder dan nama file berikut di dalam `src/`:

```text
src/
├── db/
│   ├── index.ts              # Inisialisasi koneksi Drizzle & MySQL (sudah ada)
│   └── schema.ts             # Definisi tabel database (perlu diperbarui)
├── services/
│   └── users-service.ts      # [Baru] Business logic registrasi & database query
├── routes/
│   └── users-route.ts        # [Baru] Definisi endpoint ElysiaJS
└── index.ts                  # Entrypoint aplikasi (mount users-route)
```

> **Aturan Penamaan:**
> - File routing di dalam `src/routes/` menggunakan akhiran `-route.ts` (contoh: `users-route.ts`).
> - File logic di dalam `src/services/` menggunakan akhiran `-service.ts` (contoh: `users-service.ts`).

---

## 3. Spesifikasi Database (Tabel `users`)

### Definisi Kolom:
Perbarui tabel `users` pada file `src/db/schema.ts` dengan atribut berikut:

| Nama Kolom   | Tipe Data       | Keterangan                                              |
|--------------|-----------------|---------------------------------------------------------|
| `id`         | `serial` / INT  | Primary key, auto-increment                             |
| `name`       | `varchar(255)`  | NOT NULL                                                |
| `email`      | `varchar(255)`  | NOT NULL, UNIQUE                                        |
| `password`   | `varchar(255)`  | NOT NULL (Menyimpan hash bcrypt, BUKAN plain text)     |
| `created_at` | `timestamp`     | NOT NULL, DEFAULT CURRENT_TIMESTAMP (`now()`)           |

---

## 4. Spesifikasi Kontrak API

### Endpoint:
- **Method**: `POST`
- **URL**: `/api/users`
- **Content-Type**: `application/json`

### Request Body:
```json
{
    "name": "Eko",
    "email": "eko@localhost",
    "password": "rahasia"
}
```

### Validasi Input:
- `name`: String, minimal 1 karakter, wajib diisi.
- `email`: String format email valid, wajib diisi.
- `password`: String, minimal 1 karakter (rekomendasi min. 6 karakter), wajib diisi.

### Response Sukses (HTTP 200 / 201):
```json
{
    "data": "OK"
}
```

### Response Gagal - Email Sudah Terdaftar (HTTP 400):
```json
{
    "error": "Email sudah terdaftar"
}
```

### Response Gagal - Validasi Input (HTTP 400 / 422):
Jika format request body tidak sesuai (misal: field kosong atau format email keliru):
```json
{
    "error": "Data input tidak valid"
}
```

---

## 5. Tahapan Implementasi (Step-by-Step)

### Tahap 1: Pembaruan Skema Database (`src/db/schema.ts`)
1. Buka `src/db/schema.ts`.
2. Pastikan tabel `users` mendefinisikan kolom: `id`, `name`, `email` (unique), `password`, dan `createdAt` (`created_at`).
3. Export tipe inferensi TypeScript:
   - `User` (`typeof users.$inferSelect`)
   - `NewUser` (`typeof users.$inferInsert`)

### Tahap 2: Sinkronisasi Skema ke Database
Jalankan salah satu perintah berikut melalui terminal:
- Generate file migrasi baru:
  ```bash
  bun run db:generate
  ```
- Terapkan perubahan ke database:
  ```bash
  bun run db:push
  ```
  *(Pastikan koneksi MySQL di `.env` aktif dan dapat diakses).*

### Tahap 3: Implementasi Service Layer (`src/services/users-service.ts`)
Buat file `src/services/users-service.ts` yang berisi fungsi registrasi:
1. **Cek Duplikasi Email**:
   - Query ke database: cari record `users` dengan email yang sama (`eq(users.email, email)`).
   - Jika sudah ada, lempar error atau kembalikan status gagal dengan pesan `"Email sudah terdaftar"`.
2. **Hash Password dengan Bcrypt**:
   - Gunakan hashing bawaan Bun yang sangat cepat dan kompatibel bcrypt:
     ```ts
     const hashedPassword = await Bun.password.hash(password, {
       algorithm: "bcrypt",
       cost: 10,
     });
     ```
   - *(Atau gunakan library `bcryptjs` jika diinstruksikan khusus).*
3. **Simpan User ke Database**:
   - Insert ke tabel `users` dengan nilai: `name`, `email`, dan `password: hashedPassword`.
4. **Return Nilai**:
   - Kembalikan objek `{ success: true, data: "OK" }` atau lempar error yang sesuai.

### Tahap 4: Implementasi Route Layer (`src/routes/users-route.ts`)
Buat file `src/routes/users-route.ts`:
1. Buat instance router Elysia:
   ```ts
   import { Elysia, t } from "elysia";
   ```
2. Definisikan endpoint `POST /` (yang nanti akan diprefix `/api/users`):
   - Gunakan skema validasi Elysia (`t.Object`) untuk `name`, `email`, dan `password`.
3. Di dalam handler:
   - Panggil fungsi registrasi dari `users-service.ts`.
   - Tangani jika terjadi duplikasi email: kembalikan status `400` dan body `{ "error": "Email sudah terdaftar" }`.
   - Tangani jika berhasil: kembalikan status `200` (atau `201`) dan body `{ "data": "OK" }`.
   - Tangani error umum lainnya: kembalikan status `500` dengan pesan error yang rapi.

### Tahap 5: Pendaftaran Route di Entrypoint (`src/index.ts`)
1. Buka `src/index.ts`.
2. Import `usersRoute` dari `./routes/users-route`.
3. Daftarkan router dengan prefix `/api/users`:
   ```ts
   app.group("/api/users", (app) => app.use(usersRoute));
   // atau
   app.use(usersRoute); // jika prefix sudah diset di dalam users-route
   ```
4. Pastikan route lama (jika ada `/users` contoh awal) digantikan atau dinonaktifkan agar tidak bertabrakan.

---

## 6. Checklist Verifikasi & Pengujian

Sebelum menyelesaikan tugas, lakukan checklist pengujian berikut:

1. **Typecheck Bebas Error**:
   ```bash
   bun run typecheck
   ```
   Pastikan tidak ada error tipe TypeScript.

2. **Jalankan Server Development**:
   ```bash
   bun run dev
   ```

3. **Uji Kasus 1: Registrasi User Baru (Sukses)**:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Eko", "email": "eko@localhost", "password": "rahasia"}'
   ```
   *Ekspektasi Output*:
   ```json
   { "data": "OK" }
   ```

4. **Uji Kasus 2: Registrasi Email yang Sama (Gagal/Duplikat)**:
   Jalankan perintah yang sama sekali lagi:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Eko", "email": "eko@localhost", "password": "rahasia"}'
   ```
   *Ekspektasi Output*:
   ```json
   { "error": "Email sudah terdaftar" }
   ```

5. **Uji Kasus 3: Verifikasi di Database**:
   - Periksa tabel `users` di MySQL.
   - Pastikan field `password` tersimpan dalam format hash bcrypt (berawalan `$2a$` atau `$2b$`), **bukan** plaintext `"rahasia"`.

