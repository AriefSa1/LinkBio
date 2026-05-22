-- ============================================================
-- MIGRASI v2 — jalankan di phpMyAdmin (tab "SQL") pada database
-- u515949342_Team94 KARENA tabelnya sudah dibuat sebelumnya.
-- Menambahkan: foto upload (avatarData) + role admin (isAdmin).
-- ============================================================

ALTER TABLE `User` ADD COLUMN `avatarData` LONGTEXT NULL;
ALTER TABLE `User` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- --------------------------------------------------------------
-- Jadikan akunmu sebagai ADMIN.
-- Ganti 'usernamemu' dengan username akun yang sudah kamu daftarkan.
-- (Daftar dulu lewat /register kalau belum punya akun.)
-- --------------------------------------------------------------
UPDATE `User` SET `isAdmin` = true WHERE `username` = 'usernamemu';
