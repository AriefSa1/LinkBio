# 🔗 Linktree Clone

Website mirip Linktree dibuat dengan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Prisma + SQLite**.

Fitur:

- 👥 **Multi-user** — siapa saja bisa daftar & login, masing-masing punya halaman sendiri
- 🛠️ **Dashboard (admin panel)** — edit profil, pilih tema, tambah/edit/hapus/urutkan link
- 🌐 **Halaman publik** di `/[username]` — tampilan ala Linktree yang siap dibagikan
- 🎨 **5 tema** bawaan (Midnight, Sunset, Forest, Mono, Grape)
- 🔐 Autentikasi sendiri (password di-hash bcrypt, sesi JWT di cookie httpOnly)

---

## 🚀 Cara menjalankan (lokal)

Butuh **Node.js 18.18+** (disarankan 20+) dan **server MySQL** (mis. via XAMPP/Laragon, Docker, atau MySQL lokal). Project ini dikonfigurasi untuk MySQL agar cocok dengan hosting Hostinger.

> Belum punya MySQL lokal dan hanya ingin mencoba cepat? Ganti `provider = "mysql"` jadi `provider = "sqlite"` di `prisma/schema.prisma`, dan set `DATABASE_URL="file:./dev.db"` di `.env`. Untuk deploy ke Hostinger, gunakan MySQL.

1. Buat database MySQL kosong, lalu isi `DATABASE_URL` di `.env`:
   `mysql://USER:PASSWORD@localhost:3306/NAMA_DATABASE`

```bash
# 1. Install dependency
npm install

# 2. Siapkan tabel + buat data demo (sekali jalan)
npm run setup
#   ^ menjalankan: prisma generate, prisma db push, prisma db seed

# 3. Jalankan server development
npm run dev
```

Buka **http://localhost:3000**

### Akun demo

Sudah dibuatkan otomatis lewat seed:

| Field    | Nilai      |
| -------- | ---------- |
| Username | `demo`     |
| Password | `demo1234` |

- Halaman publik demo: http://localhost:3000/demo
- Login: http://localhost:3000/login

> ⚠️ Sebelum dipakai serius/produksi, ganti `AUTH_SECRET` di file `.env`
> dengan string acak. Contoh generate: `openssl rand -base64 32`

---

## 📁 Struktur project

```
linktree-clone/
├── prisma/
│   ├── schema.prisma        # Model database (User, Link)
│   └── seed.ts              # Data demo
├── src/
│   ├── middleware.ts        # Proteksi rute /dashboard
│   ├── lib/
│   │   ├── prisma.ts        # Koneksi database
│   │   ├── session.ts       # Sesi JWT (cookie httpOnly)
│   │   ├── auth.ts          # Hash password, getCurrentUser, normalisasi URL
│   │   └── themes.ts        # Definisi tema halaman publik
│   ├── components/
│   │   └── SubmitButton.tsx # Tombol dengan status loading
│   └── app/
│       ├── layout.tsx       # Layout + font
│       ├── globals.css
│       ├── page.tsx         # Landing page
│       ├── not-found.tsx    # Halaman 404
│       ├── (auth)/
│       │   ├── actions.ts   # register / login / logout
│       │   ├── login/page.tsx
│       │   └── register/page.tsx
│       ├── dashboard/
│       │   ├── page.tsx     # Admin panel
│       │   └── actions.ts   # CRUD profil & link
│       └── [username]/
│           └── page.tsx     # Halaman publik
└── package.json
```

---

## 🧩 Cara kerja singkat

- **Autentikasi**: password di-hash pakai `bcryptjs`. Setelah login, server membuat token JWT (`jose`) dan menyimpannya di cookie `httpOnly`. `middleware.ts` mengecek token ini untuk melindungi `/dashboard`.
- **Data**: Prisma + SQLite (file `prisma/dev.db`). Tidak perlu server database terpisah.
- **Mutasi data**: memakai **Server Actions** Next.js (lihat `actions.ts`). Setiap aksi memverifikasi kepemilikan data sebelum mengubah/menghapus.

---

## 🔧 Perintah berguna

```bash
npm run dev        # mode development
npm run build      # build produksi (otomatis prisma generate)
npm run start      # jalankan hasil build
npm run db:studio  # buka Prisma Studio (GUI lihat database)
npm run db:seed    # isi ulang data demo
```

---

## 💡 Ide pengembangan lanjutan

- Upload foto profil (mis. pakai UploadThing / Cloudinary / S3)
- Hitung klik per link (analytics)
- Drag-and-drop untuk mengurutkan link
- Login sosial (Google/GitHub) via Auth.js
- Ganti SQLite → PostgreSQL saat deploy (cukup ubah `provider` & `DATABASE_URL`)

---

## 🌍 Deploy

Paling mudah ke **Vercel**. Untuk produksi, ganti database SQLite ke
PostgreSQL (mis. Neon/Supabase) karena filesystem serverless bersifat sementara:

1. Ubah `provider = "postgresql"` di `prisma/schema.prisma`
2. Set `DATABASE_URL` & `AUTH_SECRET` di Environment Variables
3. Deploy 🚀
```
