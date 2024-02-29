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
        Penulis: true,
        Tahunterbit: true,
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

export async function createBuku(req, res) {
    const { BukuID, Judul, Penerbit, Penulis, Tahunterbit } = req.body;
  
    try {
      let buku = await prisma.buku.create({
        data: {
            BukuID,
            Judul,
            Penerbit,
            Penulis,
            Tahunterbit,
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
    const { Judul, Penerbit, Penulis, Tahunterbit } = req.body;
  
    try {
      let buku = await prisma.buku.update({
        where: { BukuID: parseInt(id) },
        data: {
            Judul,
            Penerbit,
            Penulis,
            Tahunterbit,
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