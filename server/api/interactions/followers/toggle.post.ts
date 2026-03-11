export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { followerProfileId, followingProfileId } = body;

  if (!followerProfileId || !followingProfileId) {
    throw createError({
      statusCode: 400,
      message: "followerProfileId and followingProfileId are required",
    });
  }

  if (followerProfileId === followingProfileId) {
    throw createError({ statusCode: 400, message: "Cannot follow yourself" });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerProfileId_followingProfileId: {
        followerProfileId,
        followingProfileId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { following: false };
  } else {
    await prisma.follow.create({
      data: { followerProfileId, followingProfileId },
    });
    return { following: true };
  }
});
