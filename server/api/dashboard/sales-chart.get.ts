export default defineEventHandler(async (event) => {
  try {
    const period = (getQuery(event).period as Period) || "week";

    // Auth
    const userId = await requireAuthUserId(event);
    const profileId = await getProfileIdFromUserId(userId);
    const { startDate, buckets, labels, getKey } = buildChartConfig(period);

    // Fetch sales with prices
    const sales = await prisma.orderItem.findMany({
      where: {
        beat: { producerId: profileId },
        order: { status: "COMPLETED" },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        price: true,
      },
    });

    const revenues = toRevenues(sales, buckets, getKey);
    const totalRevenue = revenues.reduce((sum, val) => sum + val, 0);

    return {
      labels,
      revenues,
      totalRevenue,
      totalSales: sales.length,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch sales chart data",
    });
  }
});
