export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "beatId");
  const query = getQuery(event);
  const profileId = query.profileId as string;

  if (!id || !profileId) {
    throw createError({
      statusCode: 400,
      message: "Comment ID and profileId are required",
    });
  }

  // Verify the comment exists and fetch its beat information
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { beat: true },
  });

  if (!comment) {
    throw createError({ statusCode: 404, message: "Comment not found" });
  }

  // Allow deletion if user is either the comment author OR the beat owner
  const isCommentAuthor = comment.profileId === profileId;
  const isBeatOwner = comment.beat.producerId === profileId;

  if (!isCommentAuthor && !isBeatOwner) {
    throw createError({
      statusCode: 403,
      message:
        "You can only delete your own comments or comments on your beats",
    });
  }

  await prisma.comment.delete({ where: { id } });

  return { success: true };
});
