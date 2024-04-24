import prisma from "../../prisma/client";

export async function getPeminjaman(req, res) {
    const {skip} = req.query;
    const skipValue = skip ? Number(skip) : 0;

    try {
        let peminjaman = await prisma.peminjaman.findMany({
            skip: skipValue,
            select: {
                PeminjamanID: true,
                UserID: true,
                BookID: true,
                Tanggalpeminjaman: true,
                Tanggalpeminjaman: true,
                Statuspeminjaman: true,
                Buku: {
                  select: {
                    BookID : true,
                    Judul: true,
                    Tahunterbit: true,
                    Penulis: true,
                  
                    Penerbit: true,
                    Deskripsi: true,
                    Gambar: true,
                  }
                },
                User : {
                  select : {
                    NamaLengkap: true,
                    Alamat: true,
                    Email: true,
                    Username: true,
                    Role: true,
                  }
                }
            }
        });

        let count = await prisma.peminjaman.count();

        res.status(201).json({
            message: "Peminjaman found successfully",
            total: count,
            data: peminjaman,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error,
        });
    }
}

export async function getPeminjamanID(req, res) {
  const { id } = req.query;

  try {
      let peminjaman = await prisma.peminjaman.findUnique({
          where: {
              PeminjamanID: parseInt(id) // Assuming UserID is a numeric field
          },
          select: {
              PeminjamanID: true,
              UserID: true,
              BukuID: true,
              Tanggalpeminjaman: true,
              Tanggalpengembalian: true,
              Statuspeminjaman: true,
              Buku: {
                  select: {
                      BukuID: true,
                      Judul: true,
                      Tahunterbit: true,
                      Penulis: true,
           
                      Penerbit: true,
                      Deskripsi: true,
                      Gambar: true,
                  }
              },
              User: {
                select : {
                  NamaLengkap: true,
                }
              }
          }
      });

      
      if (!peminjaman) {
        res.status(401).json({
          message: "Peminjaman tidak di temukan",
          data: peminjaman,
        });
      }

      res.status(201).json({
          message: "Peminjaman found successfully",
          data: peminjaman,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message: "Internal server error",
          error: error,
      });
  }
}


export async function createPeminjaman(req, res) {
    const { UserID, BookID, Tanggalpeminjaman, Tanggalpengembalian, Statuspeminjaman } = req.body;
  
    try {

      let peminjaman = await prisma.peminjaman.create({
        data: {
          Tanggalpeminjaman : new Date(Tanggalpeminjaman),
          Tanggalpengembalian : new Date(Tanggalpengembalian),
          Statuspeminjaman: Statuspeminjaman,
          User: {
            connect: {
              UserID: parseInt(UserID)
            }
          },
          Buku: {
            connect: {
              BukuID: parseInt(BookID)
            }
          }
        },
      });
      res.status(201).json({
        message: "Buku terpinjam",
        data: peminjaman,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  export async function getPeminjamanUserID(req, res) {
    const { userId } = req.query;
  
    try {
      let peminjaman = await prisma.peminjaman.findMany({
        where: {
          UserID: parseInt(userId), // Assuming UserID is a numeric field
        },
        select: {
          PeminjamanID: true,
          UserID: true,
          BukuID: true,
          Tanggalpeminjaman: true,
          Tanggalpengembalian: true,
          Statuspeminjaman: true,
          User: {
            select: {
              NamaLengkap: true,
              Username: true,
              Alamat: true,
              Email: true,
            }
          },
          Buku: true,
          // Buku: {
          //     select: {
          //         BookID: true,
          //         Judul: true,
          //         Tahunterbit: true,
          //         Penulis: true,
          //         Jumlahhlmn: true,
          //         Penerbit: true,
          //         Deskripsi: true,
          //         Gambar: true,
          //     }
          // },
          // User: {
          //   select: {
          //     UserID: true,
          //     Namalengkap: true,
          //     Alamat: true,
          //     Email: true,
          //     Username: true,
          //     Role: true,
          //   }
          // }
        },
      });
  
      if (!peminjaman || peminjaman.length === 0) {
        return res.status(404).json({
          message: "Peminjaman tidak ditemukan",
          data: [],
        });
      }
  
      peminjaman = peminjaman.map((item) => ({
        ...item,
        Tanggalpeminjaman: item.Tanggalpeminjaman.toISOString().substring(0, 10),
        Tanggalpengembalian: item.Tanggalpengembalian.toISOString().substring(0, 10),
      }));
  
      res.status(201).json({
        message: "Peminjaman found successfully",
        data: peminjaman,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async function updatePeminjamanStatus() {
    try {
      const peminjaman = await prisma.peminjaman.findMany({
        where: {
          Tanggalpeminjaman: {
            lt: new Date(), // Memeriksa peminjaman yang TglPengembalian-nya sudah lewat
          },
          Status: "dipinjam", // Memeriksa peminjaman yang masih dalam status "Sedang Pinjam"
        },
      });
  
      if (peminjaman && peminjaman.length > 0) {
        await Promise.all(
          peminjaman.map(async (p) => {
            await prisma.peminjaman.update({
              where: { PeminjamanID: p.PeminjamanID },
              data: { Status: "selesai" },
            });
          })
        );
      }
    } catch (error) {
      console.error("Error updating peminjaman status:", error);
    }
  }
  
  // Fungsi untuk menjalankan updatePeminjamanStatus() setiap jam sekali
  setInterval(updatePeminjamanStatus, 60000); // 3600000 milidetik = 1 jam

  export async function getPeminjamanSedangPinjamUserID(req, res) {
    const { userId } = req.query;
  
    try {
      const peminjaman = await prisma.peminjaman.findMany({
        where: {
          UserID: parseInt(userId),
          Status: "dipinjam",
        },
        include: {
          User: {
            select : {
              NamaLengkap: true,
              Username: true,
              Alamat: true,
              Email: true,
            }
          },
          Buku: true,
        },
      });
  
      res.status(200).json({
        message: "Peminjaman ditemukan",
        data: peminjaman,
      });
    } catch (error) {
      console.error("Error getting peminjaman:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }