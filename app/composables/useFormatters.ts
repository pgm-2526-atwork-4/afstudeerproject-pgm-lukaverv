/**
 * Shared formatting utilities for display values.
 */
export const useFormatters = () => {
  /**
   * Formats a large number to a short human-readable string.
   * 1000 => "1.0K", 1000000 => "1.0M"
   */
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  /**
   * Formats a date to a human-readable string.
   * e.g. "14 March 2026"
   */
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /**
   * Formats a date to a relative time string.
   * e.g. "just now", "5m ago", "2h ago", "3d ago"
   */
  const formatTimeAgo = (date: string | Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return { formatNumber, formatDate, formatTimeAgo };
};
