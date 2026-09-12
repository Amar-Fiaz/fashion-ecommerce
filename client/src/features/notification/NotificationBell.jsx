import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "./notificationApi";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3a4 4 0 0 0-4 4v3l-1.5 3h11L14 10V7a4 4 0 0 0-4-4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8.5 16a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-w-[90vw] bg-white border border-neutral-200 rounded-md shadow-lg z-30 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-sm font-medium text-black">Notifications</span>
            <Link
              to="/notifications"
              className="text-xs text-neutral-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
          </div>

          {notifications.length === 0 && (
            <p className="text-sm text-neutral-500 p-3">No notifications yet.</p>
          )}

          {notifications.slice(0, 5).map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`w-full text-left p-3 border-b border-neutral-100 text-sm ${
                n.isRead ? "text-neutral-500" : "text-black bg-neutral-50"
              }`}
            >
              {n.message}
              <span className="block text-xs text-neutral-400 mt-0.5">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;