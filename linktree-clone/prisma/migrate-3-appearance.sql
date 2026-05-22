-- ============================================================
-- MIGRASI v3 — fitur kustomisasi tampilan halaman.
-- Jalankan SEKALI di phpMyAdmin (tab "SQL") pada database yang
-- SUDAH ada. Aman, tidak menghapus data.
-- (Hanya perlu jika kamu sudah pernah menjalankan migrasi sebelumnya.)
-- ============================================================

ALTER TABLE `User` ADD COLUMN `bgType`   VARCHAR(191) NOT NULL DEFAULT 'theme';
ALTER TABLE `User` ADD COLUMN `bgColor`  VARCHAR(32)  NULL;
ALTER TABLE `User` ADD COLUMN `bgImage`  LONGTEXT     NULL;
ALTER TABLE `User` ADD COLUMN `cardMode` BOOLEAN      NOT NULL DEFAULT false;
