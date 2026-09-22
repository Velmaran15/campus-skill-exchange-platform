import { Notification } from "../../types";
import { UserAvatar } from "../common/UserAvatar";
import {
    Bell,
    CheckCircle,
    XCircle,
    Star
} from "lucide-react";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (notification: Notification) => void;
}

export const NotificationItem = ({
    notification,
    onMarkAsRead,
}: NotificationItemProps) => {

    const getNotificationStyle = () => {
        switch (notification.type) {
            case "session_request":
                return {
                    icon: (
                        <Bell
                            size={18}
                            className="text-blue-600"
                        />
                    ),
                    badge: "NEW",
                    badgeColor:
                        "bg-blue-100 text-blue-700"
                };
            case "session_accepted":
                return {
                    icon: (
                        <CheckCircle
                            size={18}
                            className="text-green-600"
                        />
                    ),
                    badge: "ACCEPTED",
                    badgeColor:
                        "bg-green-100 text-green-700"
                };
            case "session_rejected":
                return {
                    icon: (
                        <XCircle
                            size={18}
                            className="text-red-600"
                        />
                    ),
                    badge: "REJECTED",
                    badgeColor:
                        "bg-red-100 text-red-700"
                };
            case "review_received":
                return {
                    icon: (
                        <Star
                            size={18}
                            className="text-amber-500 fill-amber-500"
                        />
                    ),
                    badge: "REVIEW",
                    badgeColor:
                        "bg-amber-100 text-amber-700"
                };
            default:
                return {
                    icon: <Bell size={18} />,
                    badge: "",
                    badgeColor: ""
                };
        }
    };

    const formatTime = (date: string) => {
        const now = new Date();
        const created = new Date(date);
        const diff = Math.floor(
            (now.getTime() - created.getTime()) / 1000
        );
        if (diff < 60)
            return "Just now";
        if (diff < 3600)
            return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400)
            return `${Math.floor(diff / 3600)} hr ago`;
        return created.toLocaleDateString();
    };

    const style = getNotificationStyle();

    return (
        <div
            onClick={() => onMarkAsRead(notification)}
            className={` flex gap-4 p-4 border-b transition-all cursor-pointer hover:bg-amber/5 ${notification.isRead ? "bg-white" : "bg-blue-50 border-l-4 border-l-blue-500"}`}
        >

            <UserAvatar
                name={notification.sender.name}
                profileImage={notification.sender.profileImage}
                size="md"
            />

            <div className="flex-1">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        {style.icon}
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-gray-900">
                                {notification.title}
                            </h4>
                            <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-full ${style.badgeColor}`}
                            >
                                {style.badge}
                            </span>
                        </div>
                    </div>
                    {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-6">
                    {notification.message}
                </p>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">
                        {formatTime(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                        <span className="text-xs text-blue-600 font-semibold">
                            ● Unread
                        </span>
                    )}
                </div>
            </div>

        </div>

    );
};