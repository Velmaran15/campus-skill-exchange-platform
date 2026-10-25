import multer from "multer";
import path from "path";
import { ensureUploadDir, chatUploadPath } from "../utils/ensureUploadDir";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            ensureUploadDir(chatUploadPath);
            cb(null, chatUploadPath);
        } catch (error) {
            cb(error as Error, chatUploadPath);
        }
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {

    const allowedTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",

        // Documents
        "application/pdf",

        // Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        // Text
        "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `File type ${file.mimetype} is not allowed`
            )
        );
    }
};

export const chatUpload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});