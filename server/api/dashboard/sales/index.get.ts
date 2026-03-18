import jwt from "jsonwebtoken";
import { getToken } from "#auth";

type Period = "week" | "month" | "year" | "all";

function getPeriodStartDate(period: Period): Date {
  const now = new Date();

  if (period === "week") {
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (period === "year") {
    return new Date(now.getFullYear(), 0, 1);
  }

  // "all"
  return new Date("2020-01-01");
}

export default defineEventHandler(async (event) => {
  const period = (getQuery(event).period as Period) || "all";

  // Auth
  let userId: string | null = null;

  const token = await getToken({ event });
  if (token?.email) {
    const user = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: { id: true },
    });
    if (user) userId = user.id;
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
      } catch {
        throw createError({ statusCode: 401, message: "Invalid token" });
      }
    }
  }

  if (!userId) {
    throw createError({ statusCode: 401, message: "Authentication required" });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  const startDate = getPeriodStartDate(period);

  const sales = await prisma.orderItem.findMany({
    where: {
      beat: { producerId: profile.id },
      order: { status: "COMPLETED" },
      createdAt: { gte: startDate },
    },
    include: {
      beat: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          genre: true,
          bpm: true,
        },
      },
      buyer: {
        select: {
          id: true,
          userId: true,
          username: true,
          profilePicture: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sales.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    beatId: item.beatId,
    beatTitle: item.beat.title,
    beatCover: item.beat.coverImage,
    beatGenre: item.beat.genre,
    beatBpm: item.beat.bpm,
    licenseType: item.licenseType,
    price: item.price,
    createdAt: item.createdAt,
    buyer: {
      id: item.buyer.id,
      userId: item.buyer.userId,
      username: item.buyer.username,
      profilePicture: item.buyer.profilePicture,
    },
  }));
});
