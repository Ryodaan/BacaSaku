-- CreateTable
CREATE TABLE `User` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Alamat` VARCHAR(191) NOT NULL,
    `NamaLengkap` VARCHAR(191) NOT NULL,
    `Role` ENUM('pengguna', 'petugas', 'admin') NOT NULL DEFAULT 'pengguna',

    UNIQUE INDEX `User_Username_key`(`Username`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Buku` (
    `BukuID` INTEGER NOT NULL AUTO_INCREMENT,
    `Judul` VARCHAR(191) NOT NULL,
    `Penerbit` VARCHAR(191) NOT NULL,
    `Penulis` VARCHAR(191) NOT NULL,
    `Tahunterbit` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`BukuID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `KategoriID` INTEGER NOT NULL AUTO_INCREMENT,
    `Namakategori` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`KategoriID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `ProfileID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PeminjamanID` INTEGER NOT NULL,
    `RiwayatID` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_UserID_key`(`UserID`),
    PRIMARY KEY (`ProfileID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategoribukurelasi` (
    `KategoribukuID` INTEGER NOT NULL AUTO_INCREMENT,
    `BukuID` INTEGER NOT NULL,
    `KategoriID` INTEGER NOT NULL,

    PRIMARY KEY (`KategoribukuID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ulasanbuku` (
    `UlasanID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `BukuID` INTEGER NOT NULL,
    `Ulasan` VARCHAR(191) NOT NULL,
    `Rating` INTEGER NOT NULL,

    PRIMARY KEY (`UlasanID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peminjaman` (
    `PeminjamanID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `BukuID` INTEGER NOT NULL,
    `Tanggalpengembalian` DATETIME(3) NOT NULL,
    `Statuspeminjaman` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PeminjamanID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Koleksipribadi` (
    `KoleksiID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `BukuID` INTEGER NOT NULL,

    PRIMARY KEY (`KoleksiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Riwayat` (
    `RiwayatID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `BukuID` INTEGER NOT NULL,

    PRIMARY KEY (`RiwayatID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_PeminjamanID_fkey` FOREIGN KEY (`PeminjamanID`) REFERENCES `Peminjaman`(`PeminjamanID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_RiwayatID_fkey` FOREIGN KEY (`RiwayatID`) REFERENCES `Riwayat`(`RiwayatID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategoribukurelasi` ADD CONSTRAINT `Kategoribukurelasi_BukuID_fkey` FOREIGN KEY (`BukuID`) REFERENCES `Buku`(`BukuID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategoribukurelasi` ADD CONSTRAINT `Kategoribukurelasi_KategoriID_fkey` FOREIGN KEY (`KategoriID`) REFERENCES `Kategori`(`KategoriID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ulasanbuku` ADD CONSTRAINT `Ulasanbuku_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ulasanbuku` ADD CONSTRAINT `Ulasanbuku_BukuID_fkey` FOREIGN KEY (`BukuID`) REFERENCES `Buku`(`BukuID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_BukuID_fkey` FOREIGN KEY (`BukuID`) REFERENCES `Buku`(`BukuID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Koleksipribadi` ADD CONSTRAINT `Koleksipribadi_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Koleksipribadi` ADD CONSTRAINT `Koleksipribadi_BukuID_fkey` FOREIGN KEY (`BukuID`) REFERENCES `Buku`(`BukuID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_BukuID_fkey` FOREIGN KEY (`BukuID`) REFERENCES `Buku`(`BukuID`) ON DELETE CASCADE ON UPDATE CASCADE;
