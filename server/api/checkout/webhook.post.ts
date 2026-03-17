import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const sig = getHeader(event, "stripe-signature");

  if (!body || !sig) {
    throw createError({
      statusCode: 400,
      message: "Missing body or signature",
    });
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      message: `Webhook signature verification failed: ${err.message}`,
    });
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) return { received: true };

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        stripePaymentId: session.payment_intent as string,
      },
    });

    // Handle exclusive beats - mark as sold + send sale notifications
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
      select: {
        id: true,
        beatId: true,
        licenseType: true,
        buyerId: true,
        beat: { select: { producerId: true } },
      },
    });

    for (const item of orderItems) {
      if (item.licenseType === "EXCLUSIVE") {
        await prisma.beat.update({
          where: { id: item.beatId },
          data: {
            isExclusiveSold: true,
            exclusiveBuyer: item.buyerId,
          },
        });
      }

      // Notify producer of the sale (skip if producer is buyer)
      if (item.beat.producerId !== item.buyerId) {
        await prisma.notification.create({
          data: {
            recipientId: item.beat.producerId,
            actorId: item.buyerId,
            type: "SALE",
            beatId: item.beatId,
            orderItemId: item.id,
          },
        });
      }
    }
  }

  return { received: true };
});
