import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
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

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Sale ID required" });

  const item = await prisma.orderItem.findUnique({
    where: { id },
    include: {
      beat: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          genre: true,
          bpm: true,
          key: true,
          duration: true,
          priceBasic: true,
          pricePremium: true,
          priceExclusive: true,
          producerId: true,
          producer: {
            select: {
              id: true,
              userId: true,
              username: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
      buyer: {
        select: {
          id: true,
          userId: true,
          username: true,
          profilePicture: true,
          firstName: true,
          lastName: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          totalAmount: true,
          stripePaymentId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!item) {
    throw createError({ statusCode: 404, message: "Sale not found" });
  }

  // Ensure the requesting producer owns this beat
  if (item.beat.producerId !== profile.id) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  return {
    id: item.id,
    orderId: item.orderId,
    beatId: item.beatId,
    beatTitle: item.beat.title,
    beatCover: item.beat.coverImage,
    beatGenre: item.beat.genre,
    beatBpm: item.beat.bpm,
    beatKey: item.beat.key,
    beatDuration: item.beat.duration,
    licenseType: item.licenseType,
    price: item.price,
    createdAt: item.createdAt,
    stripePaymentId: item.order.stripePaymentId,
    orderStatus: item.order.status,
    totalAmount: item.order.totalAmount,
    buyer: {
      id: item.buyer.id,
      userId: item.buyer.userId,
      username: item.buyer.username,
      profilePicture: item.buyer.profilePicture,
      firstName: item.buyer.firstName,
      lastName: item.buyer.lastName,
      email: item.buyer.user.email,
    },
    producer: {
      id: item.beat.producer.id,
      userId: item.beat.producer.userId,
      username: item.beat.producer.username,
      profilePicture: item.beat.producer.profilePicture,
      firstName: item.beat.producer.firstName,
      lastName: item.beat.producer.lastName,
      email: item.beat.producer.user.email,
    },
  };
});
