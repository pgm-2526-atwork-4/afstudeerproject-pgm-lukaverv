import jwt from "jsonwebtoken";
import { getToken } from "#auth";

type Period = "week" | "month" | "year" | "all";

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

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildConfig(period: Period) {
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

function toRevenues(
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

export default defineEventHandler(async (event) => {
  try {
    const period = (getQuery(event).period as Period) || "week";

    // Auth
    let userId: string | null = null;

    const token = await getToken({ event });
    if (token?.email) {
      const oauthUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { id: true },
      });
      if (oauthUser) userId = oauthUser.id;
    }

    if (!userId) {
      const authToken = getCookie(event, "auth_token");
      if (authToken) {
        try {
          const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET || "your-secret-key",
          ) as { id: string };
          userId = decoded.id;
        } catch {}
      }
    }

    if (!userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw createError({ statusCode: 404, message: "Profile not found" });
    }

    const profileId = profile.id;
    const { startDate, buckets, labels, getKey } = buildConfig(period);

    // Fetch sales with prices
    const sales = await prisma.orderItem.findMany({
      where: {
        beat: { producerId: profileId },
        order: { status: "COMPLETED" },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        price: true,
      },
    });

    const revenues = toRevenues(sales, buckets, getKey);
    const totalRevenue = revenues.reduce((sum, val) => sum + val, 0);

    return {
      labels,
      revenues,
      totalRevenue,
      totalSales: sales.length,
    };
  } catch (error) {
    console.error("Sales chart error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch sales chart data",
    });
  }
});
