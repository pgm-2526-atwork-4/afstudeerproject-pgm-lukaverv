export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  const { username, profilePicture } = await readBody(event);

  // Validate at least one field is provided
  if (!username && !profilePicture) {
    throw createError({
      statusCode: 400,
      message: "At least one field (username or profilePicture) is required",
    });
  }

  try {
    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw createError({
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // Check if username is taken by another user
    if (username && username !== existingProfile.username) {
      const usernameExists = await prisma.profile.findUnique({
        where: { username },
      });

      if (usernameExists) {
        throw createError({
          statusCode: 409,
          message: "Username already exists",
        });
      }
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(username && { username }),
        ...(profilePicture && { profilePicture }),
        updatedAt: new Date(),
      },
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
      },
    });

    return updatedProfile;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message: "Username already exists",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Failed to update profile",
    });
  }
});
