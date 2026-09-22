import { Bell } from "lucide-react";

interface NotificationBellProps {
    unreadCount: number;
    onClick: () => void;
}

export const NotificationBell = ({
    unreadCount,
    onClick,
}: NotificationBellProps) => {
    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-xl hover:bg-ink-100 transition-all"
        >
            <Bell
                size={22}
                className="text-ink-900"
                // values="Notification"
            />

            {unreadCount > 0 && (
                <span
                    className="
                        absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-semi boldflex items-center justify-center"
                >
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </button>
    );
};