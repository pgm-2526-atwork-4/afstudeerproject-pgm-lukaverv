export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        bio: true,
        profilePicture: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            beats: true,
          },
        },
      },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // Parse and format social links
    let formattedSocialLinks = {};
    if (profile.socialLinks) {
      try {
        const parsed =
          typeof profile.socialLinks === "string"
            ? JSON.parse(profile.socialLinks)
            : profile.socialLinks;
        formattedSocialLinks = {
          instagram: parsed.instagram || null,
          soundcloud: parsed.soundcloud || null,
          youtube: parsed.youtube || null,
        };
      } catch (e) {
        formattedSocialLinks = {};
      }
    }

    // Return formatted profile data
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
      role: profile.role,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      socialLinks: formattedSocialLinks,
      user: {
        email: profile.user.email,
      },
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      stats: {
        followers: profile._count.followers,
        following: profile._count.following,
        plays: 0, // TODO: Implement plays count
        tracks: profile._count.beats,
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch profile",
    });
  }
});
