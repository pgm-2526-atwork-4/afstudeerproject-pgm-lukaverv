import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    let userId: string | null = null;

    // Try OAuth session first
    const token = await getToken({ event });
    if (token?.email) {
      const oauthUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { id: true },
      });
      if (oauthUser) {
        userId = oauthUser.id;
      }
    }

    // Fallback to JWT token
    if (!userId) {
      const authToken = getCookie(event, "auth_token");
      if (authToken) {
        try {
          const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET || "your-secret-key",
          ) as { id: string };
          userId = decoded.id;
        } catch (error) {
          // Invalid token
        }
      }
    }

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get profile from userId
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "Profile not found",
      });
    }

    const profileId = profile.id;

    // Get top 4 tracks by play count (for this producer)
    const topTracks = await prisma.beat.findMany({
      where: {
        producerId: profileId,
      },
      include: {
        _count: {
          select: { plays: true, likes: true, comments: true },
        },
      },
      orderBy: {
        plays: {
          _count: "desc",
        },
      },
      take: 4,
    });

    // Get top 4 fans (users who played this producer's tracks the most)
    const topFans = await prisma.play.groupBy({
      by: ["profileId"],
      where: {
        beat: {
          producerId: profileId,
        },
        profileId: {
          not: null, // Only count logged-in users
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 4,
    });

    // Fetch profile details for top fans
    const fanProfileIds = topFans
      .map((f: any) => f.profileId)
      .filter((id: any): id is string => id !== null);

    const fanProfiles = await prisma.profile.findMany({
      where: {
        id: {
          in: fanProfileIds,
        },
      },
      select: {
        id: true,
        userId: true,
        username: true,
        profilePicture: true,
      },
    });

    // Map fan data with profile info
    const topFansWithProfiles = topFans.map((fan: any) => {
      const profile = fanProfiles.find((p: any) => p.id === fan.profileId);
      return {
        username: profile?.username || "Unknown User",
        userId: profile?.userId || null,
        profilePicture: profile?.profilePicture || null,
        plays: fan._count.id,
      };
    });

    // Get weekly play data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyPlays = await prisma.play.groupBy({
      by: ["createdAt"],
      where: {
        beat: {
          producerId: profileId,
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Group by day for chart data
    const playsByDay: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split("T")[0];
      if (dayKey) {
        playsByDay[dayKey] = 0;
      }
    }

    weeklyPlays.forEach((play: any) => {
      const dayKey = play.createdAt.toISOString().split("T")[0];
      if (dayKey && playsByDay[dayKey] !== undefined) {
        playsByDay[dayKey]++;
      }
    });

    // Convert to array format for chart
    const chartData = Object.entries(playsByDay)
      .map(([date, count]) => ({
        date,
        plays: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      topTracks: topTracks.map((beat: any) => ({
        id: beat.id,
        title: beat.title,
        plays: beat._count.plays,
        likes: beat._count.likes,
        comments: beat._count.comments,
        bpm: beat.bpm,
        image: beat.coverImage,
      })),
      topFans: topFansWithProfiles,
      weeklyPlays: chartData,
      totalPlays: weeklyPlays.reduce(
        (sum: number, play: any) => sum + play._count.id,
        0,
      ),
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch analytics",
    });
  }
});
