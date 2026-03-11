export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { beatId, profileId, text } = body;

  if (!beatId || !profileId || !text?.trim()) {
    throw createError({
      statusCode: 400,
      message: "beatId, profileId and text are required",
    });
  }

  const comment = await prisma.comment.create({
    data: {
      beatId,
      profileId,
      text: text.trim(),
    },
    include: {
      profile: {
        select: { id: true, username: true, profilePicture: true },
      },
    },
  });

  return {
    id: comment.id,
    text: comment.text,
    createdAt: comment.createdAt,
    profileId: comment.profileId,
    author: comment.profile.username,
    authorPicture: comment.profile.profilePicture,
  };
});
