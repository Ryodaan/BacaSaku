import prisma from "../../prisma/client";

export async function getUser(req, res) {
  const { skip } = req.query;
  const skipValue = skip ? skip : 0;

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

export async function createUser(req, res) {
  const { UserID, NamaLengkap, Alamat, Username, Email, Password } = req.body;

  try {
    let user = await prisma.user.create({
      data: {
        UserID,
        NamaLengkap,
        Alamat,
        Password,
        Username,
        Email,
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

export async function updateUser(req, res) {
    const { id } = req.query;
    const { Username, Password, Email, Alamat, NamaLengkap, Role } = req.body;
  
    try {
      let user = await prisma.user.update({
        where: { UserID: parseInt(id) },
        data: {
          Username,
          Password,
          Email,
          Alamat,
          NamaLengkap,
          Role
        },
      });
  
      res.status(200).json({
        message: "User updated successfully",
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

export async function deleteUser(req, res) {
  const { id } = req.query;

  try {
    await prisma.user.delete({
      where: {
        UserID: Number(id),
      }
    })

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}