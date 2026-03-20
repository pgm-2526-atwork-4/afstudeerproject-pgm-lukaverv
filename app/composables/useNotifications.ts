/**
 * Composable for managing notifications state globally.
 * Provides unread count, notification list, and actions to mark as read.
 */
export const useNotifications = () => {
  const userProfile = useState<any>("userProfile");

  const unreadCount = useState<number>("notificationUnreadCount", () => 0);
  const notifications = useState<any[]>("notificationsList", () => []);
  const loading = useState<boolean>("notificationsLoading", () => false);

  /** Fetch unread notification count */
  const fetchUnreadCount = async () => {
    if (!userProfile.value?.id) return;
    try {
      const data: any = await $fetch("/api/notifications/unread-count", {
        params: { profileId: userProfile.value.id },
      });
      unreadCount.value = data.count;
    } catch (e) {
      // Failed to fetch unread count
    }
  };

  /** Fetch all notifications */
  const fetchNotifications = async () => {
    if (!userProfile.value?.id) return;
    loading.value = true;
    try {
      const data: any = await $fetch("/api/notifications", {
        params: { profileId: userProfile.value.id },
      });
      notifications.value = data;
    } catch (e) {
      // Failed to fetch notifications
    } finally {
      loading.value = false;
    }
  };

  /** Mark a single notification as read or unread */
  const markAsRead = async (notificationId: string, isRead = true) => {
    if (!userProfile.value?.id) return;
    try {
      await $fetch("/api/notifications/mark-read", {
        method: "POST",
        body: { notificationId, profileId: userProfile.value.id, isRead },
      });
      const notif = notifications.value.find(
        (n: any) => n.id === notificationId,
      );
      if (notif && notif.isRead !== isRead) {
        notif.isRead = isRead;
        unreadCount.value = Math.max(0, unreadCount.value + (isRead ? -1 : 1));
      }
    } catch (e) {
      // Failed to update notification
    }
  };

  /** Toggle a notification between read and unread */
  const toggleRead = async (notificationId: string, currentIsRead: boolean) => {
    await markAsRead(notificationId, !currentIsRead);
  };

  /** Mark all notifications as read */
  const markAllAsRead = async () => {
    if (!userProfile.value?.id) return;
    try {
      await $fetch("/api/notifications/mark-all-read", {
        method: "POST",
        body: { profileId: userProfile.value.id },
      });
      // Update local state
      notifications.value.forEach((n: any) => (n.isRead = true));
      unreadCount.value = 0;
    } catch (e) {
      // Failed to mark all as read
    }
  };

  /** Delete a single notification */
  const deleteNotification = async (notificationId: string) => {
    if (!userProfile.value?.id) {
      return;
    }

    // Find notification first to check if unread
    const notification = notifications.value.find(
      (n: any) => n.id === notificationId,
    );
    if (!notification) return;

    // Optimistically remove from UI
    notifications.value = notifications.value.filter(
      (n: any) => n.id !== notificationId,
    );
    if (!notification.isRead) {
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }

    // Call API
    try {
      await $fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        query: { profileId: userProfile.value.id },
      });
    } catch (e) {
      // Re-add notification on failure
      notifications.value.push(notification);
      if (!notification.isRead) {
        unreadCount.value += 1;
      }
    }
  };

  /** Clear all notifications */
  const clearAll = async () => {
    if (!userProfile.value?.id) return;
    try {
      await $fetch("/api/notifications/clear-all", {
        method: "DELETE",
        body: { profileId: userProfile.value.id },
      });
      notifications.value = [];
      unreadCount.value = 0;
    } catch (e) {
      // Failed to clear notifications
    }
  };

  return {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    toggleRead,
    deleteNotification,
    clearAll,
  };
};
