import jwt from "jsonwebtoken";
import { getToken } from "#auth";
import { formatDuration } from "~~/server/utils/formatters";

export default defineEventHandler(async (event) => {
  try {
    let userId: string | null = null;

    // Try OAuth session first (GitHub/Google login)
    const token = await getToken({ event });

    if (token?.email) {
      const oauthUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: {
          id: true,
        },
      });
      if (oauthUser) {
        userId = oauthUser.id;
      }
    }

    // Fallback to JWT token (manual email/password login)
    if (!userId) {
      const authToken = getCookie(event, "auth_token");
      if (authToken) {
        try {
          const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET || "your-secret-key",
          ) as { id: string; email: string };
          userId = decoded.id;
        } catch (error) {
          // Invalid token
        }
      }
    }

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - Please log in",
      });
    }

    // Get the producer profile for the authenticated user
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found",
      });
    }

    // Fetch all beats created by this producer (including unpublished)
    const beats = await prisma.beat.findMany({
      where: {
        producerId: profile.id,
      },
      include: {
        producer: {
          select: {
            id: true,
            userId: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            plays: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format beats for frontend
    const formattedBeats = beats.map((beat) => {
      const formattedDuration = formatDuration(beat.duration);

      return {
        _id: beat.id,
        id: beat.id,
        title: beat.title,
        producer: beat.producer.username,
        producerId: beat.producer.id,
        producerUserId: beat.producer.userId,
        bpm: beat.bpm,
        key: beat.key,
        genre: beat.genre,
        tags: beat.tags,
        price: beat.priceBasic,
        priceBasic: beat.priceBasic,
        pricePremium: beat.pricePremium,
        priceExclusive: beat.priceExclusive,
        duration: formattedDuration,
        durationSeconds: beat.duration,
        coverImage: beat.coverImage,
        artworkUrl: beat.coverImage,
        audioUrl: beat.audioFile,
        createdAt: beat.createdAt,
        isPublished: beat.isPublished,
        isExclusiveSold: beat.isExclusiveSold,
        likesCount: beat._count.likes,
        commentsCount: beat._count.comments,
        playsCount: beat._count.plays,
      };
    });

    return formattedBeats;
  } catch (error) {
    console.error("Error fetching user beats:", error);

    // If it's already a createError, rethrow it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch beats",
    });
  }
});
