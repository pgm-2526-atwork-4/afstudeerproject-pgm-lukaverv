import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessionId = query.session_id as string;

  if (!sessionId) {
    throw createError({ statusCode: 400, message: "Session ID required" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw createError({ statusCode: 400, message: "Payment not completed" });
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw createError({ statusCode: 400, message: "Order not found" });
  }

  // Ensure order is marked completed (webhook might not have fired yet)
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "COMPLETED",
      stripePaymentId: session.payment_intent as string,
    },
    include: {
      items: {
        include: {
          beat: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              producer: {
                select: { username: true },
              },
            },
          },
        },
      },
    },
  });

  // Handle exclusive beats + send sale notifications
  for (const item of order.items) {
    if (item.licenseType === "EXCLUSIVE") {
      await prisma.beat.update({
        where: { id: item.beatId },
        data: {
          isExclusiveSold: true,
          exclusiveBuyer: item.buyerId,
        },
      });
    }

    // Notify producer (idempotent — skip if notification already exists from webhook)
    const beatProducer = await prisma.beat.findUnique({
      where: { id: item.beatId },
      select: { producerId: true },
    });
    if (beatProducer && beatProducer.producerId !== item.buyerId) {
      const exists = await prisma.notification.findFirst({
        where: { type: "SALE", orderItemId: item.id },
      });
      if (!exists) {
        await prisma.notification.create({
          data: {
            recipientId: beatProducer.producerId,
            actorId: item.buyerId,
            type: "SALE",
            beatId: item.beatId,
            orderItemId: item.id,
          },
        });
      }
    }
  }

  return {
    orderId: order.id,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      beatId: item.beatId,
      title: item.beat.title,
      coverImage: item.beat.coverImage,
      producer: item.beat.producer.username,
      licenseType: item.licenseType,
      price: item.price,
    })),
  };
});
