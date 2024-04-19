
import { createPeminjaman, getPeminjaman } from "@/controller/PeminjamanController";
import { cors, middleware } from "@/helpers/middleware";
// import { createUser, getUser, getUserID } from "@/controller/UserController";

export default async function (req, res) {
  try {
    middleware(req,res,cors);
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          await  getPeminjamanUserID(req, res);
        } else {
           await getPeminjamanID(req, res);
        }
        break;
      case "POST":
        await createPeminjaman(req, res);
        break;
      case "PATCH":
        
        break;
      case "DELETE":
        
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