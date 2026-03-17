import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  // Authenticate user
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

  // Get all completed order items for this user
  const orderItems = await prisma.orderItem.findMany({
    where: {
      buyerId: profile.id,
      order: { status: "COMPLETED" },
    },
    include: {
      beat: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          audioFileMp3: true,
          audioFileWav: true,
          bpm: true,
          key: true,
          genre: true,
          producer: {
            select: { username: true },
          },
        },
      },
      order: {
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orderItems.map((item) => ({
    id: item.id,
    beatId: item.beatId,
    title: item.beat.title,
    coverImage: item.beat.coverImage,
    producer: item.beat.producer.username,
    licenseType: item.licenseType,
    price: item.price,
    purchasedAt: item.order.createdAt,
    bpm: item.beat.bpm,
    key: item.beat.key,
    genre: item.beat.genre,
    // File URLs - the actual audio file serves as MP3
    // In a production app, you'd have separate WAV files stored
    files: getFilesForLicense(
      item.licenseType,
      item.beat.audioFileMp3,
      item.beat.audioFileWav,
    ),
  }));
});

function getFilesForLicense(
  licenseType: string,
  audioFileMp3: string,
  audioFileWav: string,
) {
  switch (licenseType) {
    case "BASIC":
      return [{ type: "MP3", url: audioFileMp3 }];
    case "PREMIUM":
      return [
        { type: "MP3", url: audioFileMp3 },
        { type: "WAV", url: audioFileWav },
      ];
    case "EXCLUSIVE":
      return [
        { type: "MP3", url: audioFileMp3 },
        { type: "WAV", url: audioFileWav },
      ];
    default:
      return [{ type: "MP3", url: audioFileMp3 }];
  }
}
