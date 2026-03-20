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

    const body = await readBody(event);
    const {
      title,
      description,
      genre,
      bpm,
      key,
      tags,
      priceBasic,
      pricePremium,
      priceExclusive,
      coverImage,
      audioFileMp3,
      audioFileWav,
      isPublished,
    } = body;

    const updated = await prisma.beat.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(genre !== undefined && { genre }),
        ...(bpm !== undefined && { bpm: parseInt(bpm) }),
        ...(key !== undefined && { key }),
        ...(tags !== undefined && { tags }),
        ...(priceBasic !== undefined && { priceBasic: parseFloat(priceBasic) }),
        ...(pricePremium !== undefined && {
          pricePremium: parseFloat(pricePremium),
        }),
        ...(priceExclusive !== undefined && {
          priceExclusive: parseFloat(priceExclusive),
        }),
        ...(coverImage !== undefined && { coverImage }),
        ...(audioFileMp3 !== undefined && { audioFileMp3 }),
        ...(audioFileWav !== undefined && { audioFileWav }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return { success: true, beat: updated };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: "Failed to update beat" });
  }
});
