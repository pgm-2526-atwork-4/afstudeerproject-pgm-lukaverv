export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({ statusCode: 400, message: "Beat ID is required" });
    }

    const userId = await requireAuthUserId(event);

    // Verify the beat belongs to this user
    const beat = await prisma.beat.findUnique({
      where: { id },
      include: { producer: { select: { userId: true } } },
    });

    if (!beat) {
      throw createError({ statusCode: 404, message: "Beat not found" });
    }

    if (beat.producer.userId !== userId) {
      throw createError({ statusCode: 403, message: "Forbidden" });
    }

    await prisma.beat.delete({ where: { id } });

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: "Failed to delete beat" });
  }
});
