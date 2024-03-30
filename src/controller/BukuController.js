import prisma from "../../prisma/client";

export async function getBuku(req, res) {
  const { skip } = req.query;
  const skipValue = skip ? skip : 0;

  try {
    let buku = await prisma.buku.findMany({
      skip: skipValue,
      select: {
        BukuID: true,
        Judul: true,
        Penerbit: true,
        Deskripsi: true,
        Penulis: true,
        Tahunterbit: true,
        Gambar: true,
      },
    });

    let count = await prisma.buku.count();

    res.status(200).json({
      message: "Buku found successfully",
      total: count,
      data: buku,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

export async function getBukuID(req, res) {
  const { id } = req.query;

  try {
    let buku = await prisma.buku.findUnique({
      where: {
        BukuID: parseInt(id),
      },
      // include: {
      //   Profile: true,
      // },
    });

    if (!buku) {
      res.status(401).json({
        message: "Buku tidak di temukan",
        data: buku,
      });
    }

    res.status(200).json({
      message: "Book found successfully",
      data: buku,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}


export async function createBuku(req, res) {
    const { BukuID, Judul, Penerbit, Penulis, Tahunterbit, Gambar, Deskripsi, } = req.body;
  
    try {
      let buku = await prisma.buku.create({
        data: {
            BukuID,
            Judul,
            Penerbit,
            Deskripsi,
            Penulis,
            Tahunterbit,
            Gambar,
            // Gambar : Gambar.toString('base64'),
        },
      });
  
      res.status(200).json({
        message: "User found successfully",
        data: buku,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  }

  export async function updateBuku(req, res) {
    const { id } = req.query;
    const { Judul, Penerbit, Penulis, Tahunterbit,  Deskripsi } = req.body;
  
    try {
      let buku = await prisma.buku.update({
        where: { BukuID: parseInt(id) },
        data: {
            Judul,
            Penerbit,
            Penulis,
            Deskripsi,
            Tahunterbit,
            Gambar,
        },
      });
  
      res.status(200).json({
        message: "Book updated successfully",
        data: buku,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
}

export async function deleteBuku(req, res) {
  const { id } = req.query;

  try {
    await prisma.buku.delete({
      where: {
        BukuID: parseInt(id),
      }
    })

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}