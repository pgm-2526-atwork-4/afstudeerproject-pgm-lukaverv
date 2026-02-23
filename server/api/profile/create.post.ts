export default defineEventHandler(async (event) => {
  const {
    userId,
    firstName,
    lastName,
    username,
    role,
    bio,
    profilePicture,
    socialLinks,
  } = await readBody(event);

  // Validate required fields
  if (!userId || !firstName || !lastName || !username || !role) {
    throw createError({
      statusCode: 400,
      message:
        "Missing required fields: userId, firstName, lastName, username, or role.",
    });
  }

  try {
    const profile = await prisma.profile.create({
      data: {
        userId,
        firstName,
        lastName,
        username,
        role,
        bio,
        profilePicture,
        socialLinks,
      },
    });

    setResponseStatus(event, 201);
    return profile;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message: "Username already exists.",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to create profile.",
    });
  }
});
