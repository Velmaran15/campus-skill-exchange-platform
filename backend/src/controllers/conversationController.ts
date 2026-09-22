import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

import Conversation from "../models/Conversation";
import Session from "../models/Session";

export const getMyConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            $or: [
                { tutor: userId },
                { learner: userId },
            ],
        })
            .populate("tutor", "name email profileImage")
            .populate("learner", "name email profileImage")
            .populate("session", "status skill")
            .sort({ lastMessageAt: -1, updatedAt: -1 });

        return res.json(conversations);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch conversations",
        });
    }
};