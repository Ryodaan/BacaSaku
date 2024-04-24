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
  const { UserID, BukuID, Tanggalpengembalian } = req.body;
  const Tanggalpeminjaman = new Date();

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(Tanggalpengembalian)) {
    return res.status(400).json({
      message: "Format tanggal harus yyyy-mm-dd",
    });
  }

  try {
    //menghitung jumlah peminjaman yang di lakukan user perharinya
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const countPeminjaman = await prisma.peminjaman.count({
      where: {
        UserID: parseInt(UserID),
        Tanggalpeminjaman: {
          gte: today,
        },
      },
    });

    //membatasi jumlah peminjaman menjadi maksimal 3 buku perhari
    if (countPeminjaman >= 3) {
      return res.status(404).json({
        message: "Anda sudah mencapai batas peminjaman pada hari ini",
      });
    }

    //memeriksa pengguna apakah meminjam buku yang sama
    const existingPeminjaman = await prisma.peminjaman.findFirst({
      where: {
        UserID: parseInt(UserID),
        BukuID: parseInt(BukuID),
        Statuspeminjaman: {
          not: "selesai", //memerikas peminjaman yang belum selesai atau masih berstatus sedang pinjam
        },
      },
    });

    if (existingPeminjaman) {
      return res.status(401).json({
        message: "Anda saat ini masih meminjam buku yang sama",
      });
    }

    let peminjaman = await prisma.peminjaman.create({
      data: {
        UserID: parseInt(UserID),
        BukuID: parseInt(BukuID),
        Tanggalpeminjaman,
        // TglPeminjaman : new Date(TglPeminjaman),
        Tanggalpengembalian: new Date(Tanggalpengembalian),
      },
    });

    res.status(201).json({
      message: "Buku terpinjam",
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

      const user = await prisma.user.findUnique({
        where: {
            UserID: parseInt(userId),
        },
        select: {
            UserID: true,
        }
    });

    if (!user) {
        return res.status(404).json({
            message: "User tidak ditemukan",
            data: [],
        });
    }

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
        },
      });

      if (peminjaman.length === 0) {
        return res.status(200).json({
          message: "Belum pinjam buku",
          data:[],
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

  export async function updatePeminjamanStatus() {
    try {
      const peminjaman = await prisma.peminjaman.findMany({
        where: {
          Tanggalpeminjaman: {
            lt: new Date(), // Memeriksa peminjaman yang TglPengembalian-nya sudah lewat
          },
          Statuspeminjaman: "dipinjam", // Memeriksa peminjaman yang masih dalam status "Sedang Pinjam"
        },
      });
  
      if (peminjaman && peminjaman.length > 0) {
        await Promise.all(
          peminjaman.map(async (p) => {
            await prisma.peminjaman.update({
              where: { PeminjamanID: p.PeminjamanID },
              data: { Statuspeminjaman: "selesai" },
            });
          })
        );
      }
    } catch (error) {
      console.error("Error updating peminjaman status:", error);
    }
  }
  
  // Fungsi untuk menjalankan updatePeminjamanStatus() setiap jam sekali
  // setInterval(updatePeminjamanStatus, 60000); // 3600000 milidetik = 1 jam

  export async function getPeminjamanSedangPinjamUserID(req, res) {
    const { userId } = req.query;
  
    try {
      const peminjaman = await prisma.peminjaman.findMany({
        where: {
          UserID: parseInt(userId),
          Statuspeminjaman: "dipinjam",
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
      
      const dataCount = peminjaman.length;

      res.status(200).json({
        message: "Peminjaman ditemukan",
        total: dataCount,
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