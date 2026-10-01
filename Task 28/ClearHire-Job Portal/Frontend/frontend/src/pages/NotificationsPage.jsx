import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notifications";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(
          "Failed to load notifications:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Unable to load your notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setUpdatingId(notificationId);
      setError("");

      const updatedNotification =
        await markNotificationRead(notificationId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to update the notification."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-gray-900"
          >
            ClearHire
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
            >
              Applications
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Candidate Area
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
                Notifications
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
                Stay informed about changes to your applications and
                recruitment activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="w-fit rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No notifications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Updates about your applications and interviews will appear
              here.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-2xl border p-5 transition ${
                  notification.is_read
                    ? "border-gray-200 bg-white"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-gray-900" />
                      )}

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {notification.type || "Notification"}
                      </p>
                    </div>

                    <h2 className="mt-2 text-base font-semibold text-gray-900">
                      {notification.title ||
                        "ClearHire Notification"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      {formatDate(
                        notification.created_at
                      )}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <button
                      type="button"
                      disabled={
                        updatingId === notification.id
                      }
                      onClick={() =>
                        handleMarkAsRead(
                          notification.id
                        )
                      }
                      className="w-fit shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === notification.id
                        ? "Updating..."
                        : "Mark as Read"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NotificationsPage;