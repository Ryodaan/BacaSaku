/*
  Warnings:

  - Added the required column `Tanggalpeminjaman` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `Tanggalpeminjaman` DATETIME(3) NOT NULL;
