/*
  Warnings:

  - You are about to alter the column `Statuspeminjaman` on the `peminjaman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `peminjaman` MODIFY `Statuspeminjaman` ENUM('dipinjam', 'selesai', 'mangkrak') NOT NULL DEFAULT 'dipinjam';
