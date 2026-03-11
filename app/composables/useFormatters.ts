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

  return { formatNumber };
};
