import { Bell } from "lucide-react";
import { Notification } from "../../types";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
    notifications: Notification[];
    loading: boolean;
    onMarkAsRead: (notification: Notification) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationDropdown = ({ notifications, loading, onMarkAsRead, onMarkAllAsRead }: NotificationDropdownProps) => {
    return (
        <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="font-bold text-lg">
                    Notifications
                </h2>
                {notifications.length > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm text-amber hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="max-h-[450px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <Bell
                            size={42}
                            className="mx-auto text-gray-300 mb-4"
                        />
                        <h3 className="font-semibold text-gray-700 text-lg">
                            No Notifications
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (

                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
};