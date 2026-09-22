import { Request, Response } from "express";
import Notification from "../models/notificationModel";


// Get All Notifications
export const getNotifications = async (req: any, res: Response) => {
    try {
        const notifications = await Notification.find({
            receiver: req.user._id,
        })
            .populate("sender", "name profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

// Get Unread Count
export const getUnreadCount = async (req: any, res: Response) => {
    try {
        const count = await Notification.countDocuments({
            receiver: req.user._id,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            unreadCount: count,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch unread count",
        });
    }
};

// Mark One Notification as Read
export const markAsRead = async (req: any, res: Response) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                receiver: req.user._id,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req: any, res: Response) => {
    try {
        await Notification.updateMany(
            {
                receiver: req.user._id,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update notifications",
        });
    }
};