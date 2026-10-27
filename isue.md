# Project Setup Plan: Bun + ElysiaJS + Drizzle ORM + MySQL

## 1. Ringkasan & Tujuan
Inisialisasi project backend baru di direktori ini menggunakan runtime **Bun**, framework **ElysiaJS**, ORM **Drizzle**, dan database **MySQL**. Dokumen ini berfungsi sebagai panduan implementasi bertahap (high-level) bagi developer atau AI agent pelaksana.

---

## 2. Tech Stack
- **Runtime & Package Manager**: [Bun](https://bun.sh)
- **Web Framework**: [ElysiaJS](https://elysiajs.com)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Database Driver**: MySQL driver (`mysql2`)
- **Database Migrations / Tooling**: `drizzle-kit`
- **Language**: TypeScript

---

## 3. Rencana Struktur Direktori (High-Level)
```text
project1/
├── src/
│   ├── db/
│   │   ├── index.ts        # Inisialisasi koneksi MySQL dengan Drizzle
│   │   └── schema.ts       # Definisi skema tabel database
│   ├── routes/             # Handler routing / endpoint API
│   └── index.ts            # Entrypoint server Elysia
├── drizzle/                # Folder hasil migrasi SQL (dihasilkan oleh drizzle-kit)
├── .env.example            # Template variabel lingkungan
├── .env                    # Konfigurasi database & port (diabaikan git)
├── .gitignore
├── drizzle.config.ts       # Konfigurasi Drizzle Kit
├── package.json
└── tsconfig.json
```

---

## 4. Langkah-Langkah Implementasi

### Tahap 1: Inisialisasi Project Bun
- Jalankan inisialisasi project Bun di folder ini (`bun init -y` atau setup manual).
- Pastikan konfigurasi `tsconfig.json` dan `.gitignore` siap untuk project TypeScript/Bun.

### Tahap 2: Instalasi Dependencies
Pasang package yang dibutuhkan:
- **Core Dependencies**:
  - `elysia`
  - `drizzle-orm`
  - `mysql2`
- **Dev Dependencies**:
  - `drizzle-kit`
  - `@types/bun`
  - `@types/node` (bila diperlukan)

### Tahap 3: Konfigurasi Environment & Database
1. Buat file `.env.example` dan `.env` yang memuat parameter koneksi MySQL:
   - `DATABASE_URL` (format: `mysql://user:password@localhost:3306/dbname`) atau format terpisah (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
   - `PORT` (default misal `3000`).
2. Konfigurasikan `drizzle.config.ts`:
   - Arahkan ke file schema (`./src/db/schema.ts`).
   - Tentukan folder output migrasi (`./drizzle`).
   - Tentukan dialect `mysql`.

### Tahap 4: Definisi Database Schema & Client
1. **Schema (`src/db/schema.ts`)**:
   - Buat minimal satu tabel contoh (misalnya tabel `users` atau `todos`) untuk memvalidasi integrasi ORM.
2. **Client DB (`src/db/index.ts`)**:
   - Buat instance connection pool MySQL dan bungkus dengan Drizzle ORM instance.

### Tahap 5: Implementasi Server Elysia
1. **Entrypoint (`src/index.ts`)**:
   - Buat server Elysia baru.
   - Tambahkan health-check endpoint (contoh: `GET /` atau `GET /health`).
   - Tambahkan route contoh yang terhubung ke database (contoh: `GET /users` dan `POST /users`) untuk membuktikan Drizzle & MySQL bekerja.
   - Jalankan server pada port yang ditentukan di environment variable.

### Tahap 6: Konfigurasi Script di `package.json`
Siapkan script standar untuk kemudahan pengoperasian:
- `"dev"`: Menjalankan server dalam mode watch (`bun run --watch src/index.ts`).
- `"build"`: Build project jika diperlukan.
- `"db:generate"`: Generate file migrasi menggunakan `drizzle-kit generate`.
- `"db:migrate"`: Menjalankan migrasi ke database MySQL.
- `"db:studio"`: Membuka Drizzle Studio untuk visualisasi data (opsional).

---

## 5. Kriteria Keberhasilan (Acceptance Criteria)
1. Project berhasil dijalankan via `bun run dev` tanpa error.
2. Endpoint server Elysia dapat diakses dan merespons request HTTP.
3. Drizzle ORM terhubung ke MySQL dan dapat melakukan query dasar ke database.
4. Perintah migrasi (`drizzle-kit`) berjalan lancar tanpa error konfigurasi.
