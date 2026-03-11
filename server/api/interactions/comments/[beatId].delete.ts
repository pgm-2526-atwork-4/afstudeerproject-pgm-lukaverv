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

  // Verify the comment belongs to this profile before deleting
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    throw createError({ statusCode: 404, message: "Comment not found" });
  }

  if (comment.profileId !== profileId) {
    throw createError({
      statusCode: 403,
      message: "You can only delete your own comments",
    });
  }

  await prisma.comment.delete({ where: { id } });

  return { success: true };
});
