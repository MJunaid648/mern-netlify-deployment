import express, { Router } from "express";
import { getUploadURL } from "../../controllers/uploadData.controller.js";
import ServerlessHttp from "serverless-http";
import cors from "cors";

const app = express();
const router = Router();
app.use(express.json());
app.use(cors())

router.get("/getPresignedURL", getUploadURL);
router.get("/test", (req, res) => {
  res.send("Hello World");
});


app.use("/api",router);
export const handler = ServerlessHttp(app);