import { getUser, getUserID } from "@/controller/UserController";

export default async function (req, res) {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.uid) {
          getUserID(req, res);
        } else {
          getUser(req, res);
        }
        break;
      case "POST":
        break;
      case "PACT":
        break;
      case "DELETE":
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end("Method ${req.method} Not Allowed");
    }
  } catch (error) {
    res.status(200).json({
      message: "Internal server error",
      error: error,
    });
  }
}

export async function getUserId(req, res) {
  const { uid } = req.query;

  try {
    let user = await prisma.user.findUnique({
      where: {
        UserID: uid,
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
