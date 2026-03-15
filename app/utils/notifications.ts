/**
 * Utility functions for notification formatting and display
 */

export const getNotificationMessage = (notif: any): string => {
  const beatTitle = notif.beat?.title ? `"${notif.beat.title}"` : "";

  switch (notif.type) {
    case "LIKE":
      return ` liked your track ${beatTitle}`;
    case "COMMENT":
      return ` commented on your track ${beatTitle}`;
    case "FOLLOW":
      return " is now following your profile";
    default:
      return "";
  }
};

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case "LIKE":
      return "ph:heart-fill";
    case "COMMENT":
      return "ph:chat-circle-fill";
    case "FOLLOW":
      return "ph:user-plus-fill";
    default:
      return "ph:bell-fill";
  }
};

export const getNotificationBadgeColor = (type: string): string => {
  switch (type) {
    case "LIKE":
      return "bg-red-500";
    case "COMMENT":
      return "bg-green-500";
    case "FOLLOW":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export const navigateFromNotification = (notif: any) => {
  if (notif.type === "FOLLOW") {
    return `/profile/${notif.actor?.userId}`;
  } else if (notif.beatId) {
    return `/beat/${notif.beatId}`;
  }
  return null;
};
