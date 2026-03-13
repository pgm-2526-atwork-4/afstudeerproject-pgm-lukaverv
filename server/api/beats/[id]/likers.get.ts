export default defineEventHandler(async (event) => {
  const beatId = getRouterParam(event, "id");

  if (!beatId) {
    throw createError({ statusCode: 400, message: "Beat ID is required" });
  }

  const likes = await prisma.like.findMany({
    where: { beatId },
    include: {
      profile: {
        select: {
          id: true,
          userId: true,
          username: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return likes.map((l) => ({
    profileId: l.profile.id,
    userId: l.profile.userId,
    username: l.profile.username,
    profilePicture: l.profile.profilePicture,
    likedAt: l.createdAt,
  }));
});
