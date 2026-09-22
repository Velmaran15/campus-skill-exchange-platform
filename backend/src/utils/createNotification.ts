import Notification from "../models/notificationModel";

interface NotificationData {
    receiver: string;
    sender: string;

    type:
    | "session_request"
    | "session_accepted"
    | "session_rejected"
    | "review_received";

    title: string;
    message: string;

    link?: string;
}

export const createNotification = async ({
    receiver,
    sender,
    type,
    title,
    message,
    link = "",
}: NotificationData) => {
    try {
        await Notification.create({
            receiver,
            sender,
            type,
            title,
            message,
            link,
        });
    } catch (error) {
        console.error("Notification Error:", error);
    }
};