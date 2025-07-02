import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express"

const app = express()
const uploadPath = path.join(__dirname,"../..", "public", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath,{recursive:true});

app.use("/uploads",express.static(uploadPath))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({storage, limits:{
  fileSize: 5 * 1024 * 1024,
}})

export const uploadSingle = upload.single("profile");
export const uploadMultiple = upload.array("images",5);