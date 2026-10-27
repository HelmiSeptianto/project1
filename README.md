# project1

Project backend menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Persyaratan
- [Bun](https://bun.sh) (v1.0+)
- MySQL Server

## Menjalankan Project

1. Salin file environment:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan `DATABASE_URL` atau konfigurasi kredensial database di `.env`.

2. Jalankan migrasi database:
   ```bash
   bun run db:generate
   bun run db:push
   ```

3. Jalankan server (mode development):
   ```bash
   bun run dev
   ```
   Server akan berjalan di `http://localhost:3000`.

## Endpoint API

- `GET /`: Health check dan info project
- `GET /health`: Health check sederhana
- `GET /users`: Ambil daftar user dari database
- `POST /users`: Tambah user baru (body JSON: `{ "name": "John", "email": "john@example.com" }`)

## Script Tersedia

- `bun run dev`: Jalankan server dengan hot-reload
- `bun run start`: Jalankan server tanpa watch mode
- `bun run typecheck`: Validasi tipe TypeScript
- `bun run db:generate`: Generate file migrasi Drizzle dari schema
- `bun run db:push`: Sinkronisasi schema langsung ke database
- `bun run db:migrate`: Jalankan migrasi SQL
- `bun run db:studio`: Buka visualisasi Drizzle Studio
