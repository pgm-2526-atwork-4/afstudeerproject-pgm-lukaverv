export default defineEventHandler(async (event) => {
  const period = (getQuery(event).period as Period) || "all";

  const userId = await requireAuthUserId(event);
  const profileId = await getProfileIdFromUserId(userId);

  const startDate = getPeriodStartDate(period, true);

  const sales = await prisma.orderItem.findMany({
    where: {
      beat: { producerId: profileId },
      order: { status: "COMPLETED" },
      createdAt: { gte: startDate },
    },
    include: {
      beat: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          genre: true,
          bpm: true,
        },
      },
      buyer: {
        select: {
          id: true,
          userId: true,
          username: true,
          profilePicture: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sales.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    beatId: item.beatId,
    beatTitle: item.beat.title,
    beatCover: item.beat.coverImage,
    beatGenre: item.beat.genre,
    beatBpm: item.beat.bpm,
    licenseType: item.licenseType,
    price: item.price,
    createdAt: item.createdAt,
    buyer: {
      id: item.buyer.id,
      userId: item.buyer.userId,
      username: item.buyer.username,
      profilePicture: item.buyer.profilePicture,
    },
  }));
});
