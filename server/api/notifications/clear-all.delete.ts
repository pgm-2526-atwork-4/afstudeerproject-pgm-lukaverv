export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { profileId } = body;

  if (!profileId) {
    throw createError({ statusCode: 400, message: "profileId is required" });
  }

  try {
    await prisma.notification.deleteMany({ where: { recipientId: profileId } });
    return { success: true };
  } catch (error: any) {
    console.error("Clear notifications error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to clear notifications",
    });
  }
});
