export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const followerProfileId = query.followerProfileId as string;
  const followingProfileId = query.followingProfileId as string;

  if (!followerProfileId || !followingProfileId) {
    throw createError({
      statusCode: 400,
      message: "followerProfileId and followingProfileId are required",
    });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerProfileId_followingProfileId: {
        followerProfileId,
        followingProfileId,
      },
    },
  });

  return { following: !!existing };
});
