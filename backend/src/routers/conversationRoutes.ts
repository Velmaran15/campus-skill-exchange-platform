import express from "express";
import { getMyConversations, } from "../controllers/conversationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getMyConversations);

export default router;