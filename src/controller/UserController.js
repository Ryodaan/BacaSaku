import prisma from "../../prisma/client";

export async function getUser(req, res) {
  const { skip } = req.query;
  const skipValue = skip ? Number(skip) : 0;

  try {
    let user = await prisma.user.findMany({
      skip: skipValue,
      select: {
        UserID: true,
        NamaLengkap: true,
        Alamat: true,
        Username: true,
        Email: true,
      },
    });

    let count = await prisma.user.count();

    res.status(200).json({
      message: "User found successfully",
      total: count,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

export async function getUserID(req, res) {
  const { uid } = req.query;

  try {
    let user = await prisma.user.findUnique({
      where: {
        UserID: parseInt(uid),
      },
      include: {
        Profile: true,
      },
    });

    res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}
