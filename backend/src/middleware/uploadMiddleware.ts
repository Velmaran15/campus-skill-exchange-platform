import multer from "multer";
import path from "path";
import { ensureUploadDir, profileUploadPath } from "../utils/ensureUploadDir";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureUploadDir(profileUploadPath);
      cb(null, profileUploadPath);
    } catch (error) {
      cb(error as Error, profileUploadPath);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  }
});

const fileFilter = (req: Express.Request,file: Express.Multer.File,cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});