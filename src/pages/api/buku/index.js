import { getBuku, createBuku, updateBuku, deleteBuku } from "@/controller/BukuController";
// import { createUser, getUser, getUserID } from "@/controller/UserController";

export default async function (req, res) {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.uid) {
          getBukuID(req, res);
        } else {
          getBuku(req, res);
        }
        break;
      case "POST":
        await createBuku(req,res);
        break;
      case "PATCH":
        await updateBuku(req,res);
        break;
      case "DELETE":
        await deleteBuku(req,res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end("Method ${req.method} Not Allowed");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}