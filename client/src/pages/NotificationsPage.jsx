import Container from "../components/Container";
import Button from "../components/Button";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../features/notification/notificationApi";

function NotificationsPage() {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsReadMutation();

  const notifications = data?.notifications || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <Container className="py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Notifications</h1>
        {hasUnread && (
          <Button variant="ghost" onClick={() => markAllAsRead()}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading && <p className="text-neutral-500">Loading...</p>}

      {!isLoading && notifications.length === 0 && (
        <p className="text-neutral-500">You have no notifications yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <button
            key={n._id}
            type="button"
            onClick={() => !n.isRead && markAsRead(n._id)}
            className={`text-left border border-neutral-200 rounded-md p-4 text-sm ${
              n.isRead ? "text-neutral-500" : "text-black bg-neutral-50"
            }`}
          >
            <p>{n.message}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </Container>
  );
}

export default NotificationsPage;