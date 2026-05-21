# 🚀 Deploy ke Hostinger (Node.js Web Apps — paket Business/Cloud)

Panduan ini untuk deploy aplikasi Linktree Clone ke **Hostinger Node.js Web Apps Hosting**.
Project sudah diubah ke **MySQL** agar datanya menetap (tidak hilang saat re-deploy).

---

## Langkah 1 — Buat database MySQL di hPanel

1. Login ke **hPanel** → menu **Databases** → **MySQL Databases** (atau "Management").
2. Buat database baru. Catat:
   - **Nama database** (mis. `u123456_linktree`)
   - **Username** (mis. `u123456_admin`)
   - **Password** (yang kamu buat)
   - **Host** (biasanya `localhost`; kalau berbeda, ikuti yang tertera di hPanel)
3. Susun jadi `DATABASE_URL`:
   ```
   mysql://USERNAME:PASSWORD@HOST:3306/NAMA_DATABASE
   ```
   Contoh:
   ```
   mysql://u123456_admin:RahasiaKuat123@localhost:3306/u123456_linktree
   ```

> Jika password mengandung karakter spesial (`@ : / # ?`), encode dulu (mis. `@` → `%40`).

---

## Langkah 2 — Siapkan kode (GitHub atau ZIP)

**Opsi A — GitHub (disarankan, bisa auto-deploy):**

```bash
git init
git add .
git commit -m "Linktree clone"
git branch -M main
git remote add origin https://github.com/USERNAME/linktree-clone.git
git push -u origin main
```

Pastikan `.env` **tidak** ikut ter-push (sudah ada di `.gitignore`). Secret diisi di Hostinger nanti.

**Opsi B — Upload ZIP:** siapkan file zip project (tanpa folder `node_modules` dan `.next`).

---

## Langkah 3 — Buat aplikasi Node.js di hPanel

1. hPanel → **Websites** → **Add Website** → pilih **Node.js Apps**.
2. Pilih sumber: **Import Git Repository** (lalu otorisasi GitHub & pilih repo), atau **upload ZIP**.
3. Periksa pengaturan yang terdeteksi otomatis. Pastikan:
   - **Build command:** `npm run build`
   - **Start command:** `npm run start`
   - **Node version:** 20 (atau 18)
   - **Install command:** `npm install`

> `npm run build` di project ini sudah otomatis menjalankan
> `prisma generate && prisma db push` sehingga **tabel database dibuat otomatis**
> saat deploy pertama.

---

## Langkah 4 — Isi Environment Variables

Di pengaturan aplikasi (Environment Variables), tambahkan:

| Key            | Value                                                    |
| -------------- | -------------------------------------------------------- |
| `DATABASE_URL` | `mysql://USERNAME:PASSWORD@HOST:3306/NAMA_DATABASE`      |
| `AUTH_SECRET`  | string acak panjang (mis. hasil `openssl rand -base64 32`) |
| `NODE_ENV`     | `production` (biasanya sudah otomatis)                   |

⚠️ **Penting:** isi env variables ini **sebelum** klik Deploy, karena `DATABASE_URL`
dibutuhkan saat build (untuk membuat tabel).

Contoh nilai `AUTH_SECRET` (JANGAN pakai yang ini — buat sendiri):
```
openssl rand -base64 32
# => contoh keluaran: 9bX2t0Qm... (32+ karakter acak)
```

---

## Langkah 5 — Deploy

Klik **Deploy**. Hostinger akan:
1. `npm install`
2. `npm run build` → generate Prisma client, buat tabel di MySQL, build Next.js
3. `npm run start` → menjalankan server

Tunggu sampai status "Running".

---

## Langkah 6 — Cek & pakai

1. Buka URL aplikasi yang diberikan Hostinger (atau domain yang kamu mapping).
2. Buka `/register` untuk membuat akun pertamamu.
3. Login → `/dashboard` untuk mengelola profil & link.
4. Halaman publik ada di `https://domainmu.com/USERNAME`.

> Akun "demo" dari seed **tidak** dibuat otomatis di produksi (build hanya `db push`,
> bukan seed). Itu disengaja — silakan daftar akun sendiri. Kalau mau membuat data demo,
> jalankan `npm run db:seed` lewat terminal/SSH (Business plan punya akses SSH).

---

## Troubleshooting

- **Build gagal saat `prisma db push`** → biasanya `DATABASE_URL` salah/belum diisi, atau
  database belum dibuat. Cek kembali Langkah 1 & 4.
- **Bisa login tapi langsung logout / sesi tidak nyimpan** → pastikan `AUTH_SECRET` terisi
  dan kamu mengakses lewat **HTTPS** (cookie sesi `secure` aktif di produksi). Hostinger
  menyediakan SSL gratis — aktifkan di hPanel → SSL.
- **Error koneksi MySQL** → pastikan host benar (sering `localhost`), port `3306`, dan
  user punya akses ke database tersebut.
- **Mau update aplikasi** → cukup `git push` (kalau pakai GitHub, bisa auto-redeploy), atau
  klik Redeploy di hPanel.

---

## Catatan untuk schema berubah di masa depan

`prisma db push` cocok untuk sinkronisasi cepat. Jika nanti kamu mengubah struktur tabel
dan butuh migrasi yang aman terhadap data, pertimbangkan beralih ke **Prisma Migrate**
(`prisma migrate dev` lokal → commit folder `prisma/migrations` → ganti build jadi
`prisma generate && prisma migrate deploy && next build`).
