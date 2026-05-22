-- ============================================================
-- Jalankan SQL ini SEKALI di phpMyAdmin (tab "SQL") pada database
-- u515949342_Team94 untuk membuat tabel yang dibutuhkan aplikasi.
-- Sesuai dengan prisma/schema.prisma.
-- ============================================================

CREATE TABLE `User` (
  `id`        VARCHAR(191) NOT NULL,
  `username`  VARCHAR(191) NOT NULL,
  `email`     VARCHAR(191) NOT NULL,
  `password`  VARCHAR(191) NOT NULL,
  `name`      VARCHAR(191) NULL,
  `bio`       VARCHAR(255) NULL,
  `avatarUrl` VARCHAR(500) NULL,
  `avatarData` LONGTEXT NULL,
  `theme`     VARCHAR(191) NOT NULL DEFAULT 'midnight',
  `bgType`    VARCHAR(191) NOT NULL DEFAULT 'theme',
  `bgColor`   VARCHAR(32)  NULL,
  `bgImage`   LONGTEXT     NULL,
  `cardMode`  BOOLEAN      NOT NULL DEFAULT false,
  `isAdmin`   BOOLEAN      NOT NULL DEFAULT false,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `User_username_key` (`username`),
  UNIQUE INDEX `User_email_key` (`email`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Link` (
  `id`        VARCHAR(191) NOT NULL,
  `title`     VARCHAR(191) NOT NULL,
  `url`       VARCHAR(500) NOT NULL,
  `icon`      VARCHAR(32)  NULL,
  `active`    BOOLEAN      NOT NULL DEFAULT true,
  `order`     INTEGER      NOT NULL DEFAULT 0,
  `userId`    VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Link_userId_idx` (`userId`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Link`
  ADD CONSTRAINT `Link_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
