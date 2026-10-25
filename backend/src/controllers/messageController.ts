import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

import Conversation from "../models/Conversation";
import Message from "../models/Message";

import { getIO } from "../socket/socket";


export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(
            conversationId
        );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const userId = req.user._id.toString();

        // Security check
        const isParticipant =
            conversation.tutor.toString() === userId ||
            conversation.learner.toString() === userId;

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not part of this conversation",
            });
        }

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate("sender", "name profileImage")
            .sort({ createdAt: 1 });

        return res.json(messages);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch messages",
        });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Message cannot be empty",
            });
        }

        const conversation = await Conversation.findById(
            conversationId
        );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const userId = req.user._id.toString();

        // Security check
        const isParticipant =
            conversation.tutor.toString() === userId ||
            conversation.learner.toString() === userId;

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not part of this conversation",
            });
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            messageType: "text",
            text: text.trim(),
            readBy: [req.user._id],
        });

        // Update conversation preview
        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();

        await conversation.save();

        const populatedMessage = await Message.findById(
            message._id
        ).populate("sender", "name profileImage");

        const io = getIO();
        io.to(conversationId).emit(
            "new_message",
            populatedMessage
        );

        return res.status(201).json(populatedMessage);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to send message",
        });
    }
};

export const uploadMessageFile = async (req: AuthRequest, res: Response) => {
    try {

        const { conversationId } = req.params;

        // 1. Find conversation
        const conversation = await Conversation.findById(
            conversationId
        );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }


        // 2. Check participant
        const userId = req.user._id.toString();

        const isParticipant =
            conversation.tutor.toString() === userId ||
            conversation.learner.toString() === userId;


        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not part of this conversation",
            });
        }


        // 3. Check file
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }


        // 4. File URL
        const fileUrl =
            `/uploads/chat/${req.file.filename}`;


        // 5. Determine message type
        const messageType =
            req.file.mimetype.startsWith("image/")
                ? "image"
                : "file";


        // 6. Create message
        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,

            messageType,

            fileUrl,

            fileName: req.file.originalname,

            readBy: [
                req.user._id
            ],
        });


        // 7. Update conversation
        conversation.lastMessage =
            `📎 ${req.file.originalname}`;

        conversation.lastMessageAt =
            new Date();

        await conversation.save();


        // 8. Populate sender
        const populatedMessage =
            await Message.findById(message._id)
                .populate(
                    "sender",
                    "name profileImage"
                );


        // Real-time delivery (same contract as text messages in sendMessage):
        // emit only after persistence succeeds, to the conversation room only.
        const io = getIO();
        io.to(conversationId).emit(
            "new_message",
            populatedMessage
        );


        return res.status(201).json(
            populatedMessage
        );

    } catch (error) {

        console.error(
            "❌ Chat file upload error:",
            error
        );

        return res.status(500).json({
            message: "Failed to upload file",
        });
    }
};