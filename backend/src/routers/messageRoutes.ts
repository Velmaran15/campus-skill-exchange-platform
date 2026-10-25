import express from "express";
import {
    getMessages,
    sendMessage,
    uploadMessageFile,
} from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";
import { chatUpload } from "../middleware/chatUploadMiddleware";
import { handleUploadError } from "../middleware/uploadErrorMiddleware";

const router = express.Router();

router.get("/:conversationId", protect, getMessages);
router.post("/:conversationId", protect, sendMessage);

router.post(
    "/:conversationId/upload",
    protect,
    (req, res, next) => {

        chatUpload.single("file")(
            req,
            res,
            (error) => {

                if (error) {
                    return handleUploadError(error, req, res, next);
                }

                next();
            }
        );
    },
    uploadMessageFile
);

export default router;