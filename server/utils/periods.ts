export type Period = "week" | "month" | "year" | "all";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Get the start date for a given period
 * Returns undefined for "all" period
 */
export function getPeriodStartDate(
  period: Period,
  includeAll: boolean = false,
): Date | undefined {
  if (period === "all" && !includeAll) return undefined;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const starts: Record<Period, Date> = {
    week: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysFromMonday,
      0,
      0,
      0,
      0,
    ),
    month: new Date(now.getFullYear(), now.getMonth(), 1),
    year: new Date(now.getFullYear(), 0, 1),
    all: new Date("2020-01-01"),
  };

  return starts[period];
}

/**
 * Convert date to YYYY-MM-DD key
 */
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Build chart configuration with buckets, labels, and date mapper
 * Used for dashboard charts
 */
export function buildChartConfig(period: Period) {
  const now = new Date();

  if (period === "week") {
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return toDateKey(d);
    });

    return {
      startDate: monday,
      buckets,
      labels: buckets.map((key) => {
        const [y, m, d] = key.split("-").map(Number);
        const date = new Date(y!, m! - 1, d!);
        return `${DAY_NAMES[date.getDay()]} ${d}`;
      }),
      getKey: (d: Date) => toDateKey(d),
    };
  }

  if (period === "month") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const totalDays = firstDayOfWeek + daysInMonth;
    const weeksCount = Math.ceil(totalDays / 7);

    const buckets = Array.from(
      { length: weeksCount },
      (_, i) => `week-${i + 1}`,
    );
    const labels = Array.from(
      { length: weeksCount },
      (_, i) => `Week ${i + 1}`,
    );

    return {
      startDate: firstDay,
      buckets,
      labels,
      getKey: (d: Date) => {
        if (d.getFullYear() !== year || d.getMonth() !== month) {
          return "";
        }
        const dayOfMonth = d.getDate();
        const weekNumber = Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
        return `week-${weekNumber}`;
      },
    };
  }

  if (period === "year") {
    const year = now.getFullYear();
    const buckets = Array.from(
      { length: 12 },
      (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`,
    );

    return {
      startDate: new Date(year, 0, 1),
      buckets,
      labels: [...MONTH_NAMES],
      getKey: (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    };
  }

  // "all"
  const currentYear = now.getFullYear();
  const buckets = Array.from({ length: currentYear - 2023 + 1 }, (_, i) =>
    String(2023 + i),
  );

  return {
    startDate: new Date("2020-01-01"),
    buckets,
    labels: [...buckets],
    getKey: (d: Date) => String(d.getFullYear()),
  };
}

/**
 * Convert array of dated items to count buckets for charts
 */
export function toCounts(
  dates: Date[],
  buckets: string[],
  getKey: (d: Date) => string,
): number[] {
  const map = Object.fromEntries(buckets.map((b) => [b, 0]));
  for (const d of dates) {
    const k = getKey(d);
    if (k in map) map[k] = (map[k] ?? 0) + 1;
  }
  return buckets.map((b) => map[b]!);
}

/**
 * Convert array of dated items with prices to revenue buckets for charts
 */
export function toRevenues(
  items: { createdAt: Date; price: number }[],
  buckets: string[],
  getKey: (d: Date) => string,
): number[] {
  const map = Object.fromEntries(buckets.map((b) => [b, 0]));
  for (const item of items) {
    const k = getKey(item.createdAt);
    if (k in map) map[k] = (map[k] ?? 0) + item.price;
  }
  return buckets.map((b) => map[b]!);
}
