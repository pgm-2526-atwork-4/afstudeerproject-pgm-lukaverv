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
    audioFile,
    isPublished,
  } = body;

  // Validate required fields
  if (
    !title ||
    !producerId ||
    !genre ||
    !bpm ||
    !coverImage ||
    !audioFile ||
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
        audioFile,
        isPublished: isPublished === true || isPublished === "true",
        duration: 180, // Default 3 minutes (will need to calculate from audio later)
      },
    });

    setResponseStatus(event, 201);
    return beat;
  } catch (error: any) {
    console.error("Beat creation error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create beat",
    });
  }
});
