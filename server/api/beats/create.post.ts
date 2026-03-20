export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    title,
    description,
    producerId,
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
    duration,
  } = body;

  // Validate required fields
  if (
    !title ||
    !producerId ||
    !genre ||
    !bpm ||
    !coverImage ||
    !audioFileMp3 ||
    !audioFileWav ||
    priceBasic == null ||
    pricePremium == null ||
    priceExclusive == null
  ) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields",
    });
  }

  try {
    const beat = await prisma.beat.create({
      data: {
        title,
        description,
        producerId,
        genre,
        bpm: parseInt(bpm),
        key: key || null,
        tags: tags || [],
        priceBasic: parseFloat(priceBasic),
        pricePremium: parseFloat(pricePremium),
        priceExclusive: parseFloat(priceExclusive),
        coverImage,
        audioFileMp3,
        audioFileWav,
        isPublished: isPublished === true || isPublished === "true",
        duration: duration ? parseInt(duration) : 0,
      },
    });

    setResponseStatus(event, 201);
    return beat;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to create beat",
    });
  }
});
