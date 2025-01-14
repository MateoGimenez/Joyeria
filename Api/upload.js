import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

export const upload = multer({storage}) //configuramos multer con storage

