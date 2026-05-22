-- ============================================================
-- MIGRASI v4 — ikon untuk setiap link (gaya tombol baru).
-- Jalankan SEKALI di phpMyAdmin (tab "SQL") pada database yang
-- SUDAH ada. Aman, tidak menghapus data.
-- ============================================================

ALTER TABLE `Link` ADD COLUMN `icon` VARCHAR(32) NULL;
