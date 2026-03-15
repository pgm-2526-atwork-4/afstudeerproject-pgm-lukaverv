export default defineEventHandler(async (event) => {
  const beatId = getRouterParam(event, "beatId");

  if (!beatId) {
    throw createError({ statusCode: 400, message: "Beat ID is required" });
  }

  const comments = await prisma.comment.findMany({
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

  return comments.map((c) => ({
    id: c.id,
    text: c.text,
    createdAt: c.createdAt,
    profileId: c.profileId,
    author: c.profile.username,
    authorPicture: c.profile.profilePicture,
    authorUserId: c.profile.userId,
  }));
});
