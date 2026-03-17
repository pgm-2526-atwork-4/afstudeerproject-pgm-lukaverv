import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { getToken } from "#auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  // Authenticate user
  let userId: string | null = null;

  const token = await getToken({ event });
  if (token?.email) {
    const oauthUser = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: { id: true },
    });
    if (oauthUser) userId = oauthUser.id;
  }

  if (!userId) {
    const authToken = getCookie(event, "auth_token");
    if (authToken) {
      try {
        const decoded = jwt.verify(
          authToken,
          process.env.JWT_SECRET || "your-secret-key",
        ) as { id: string };
        userId = decoded.id;
      } catch {
        throw createError({ statusCode: 401, message: "Invalid token" });
      }
    }
  }

  if (!userId) {
    throw createError({ statusCode: 401, message: "Authentication required" });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  const body = await readBody(event);
  const { items } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createError({ statusCode: 400, message: "Cart is empty" });
  }

  // Validate items and fetch beat data
  const beatIds = items.map((i: any) => i.beatId);
  const beats = await prisma.beat.findMany({
    where: { id: { in: beatIds } },
    select: {
      id: true,
      title: true,
      priceBasic: true,
      pricePremium: true,
      priceExclusive: true,
      isExclusiveSold: true,
      coverImage: true,
      producerId: true,
    },
  });

  // Prevent purchasing own beats
  const ownBeat = beats.find((b) => b.producerId === profile.id);
  if (ownBeat) {
    throw createError({
      statusCode: 400,
      message: `You cannot purchase your own beat: "${ownBeat.title}"`,
    });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItems: { beatId: string; licenseType: string; price: number }[] =
    [];

  for (const item of items) {
    const beat = beats.find((b) => b.id === item.beatId);
    if (!beat) continue;

    if (item.licenseType === "exclusive" && beat.isExclusiveSold) {
      throw createError({
        statusCode: 400,
        message: `"${beat.title}" is no longer available for exclusive licensing`,
      });
    }

    const prices: Record<string, number> = {
      basic: beat.priceBasic,
      premium: beat.pricePremium,
      exclusive: beat.priceExclusive,
    };
    const price = prices[item.licenseType];
    if (!price) {
      throw createError({
        statusCode: 400,
        message: `Invalid license type: ${item.licenseType}`,
      });
    }

    const licenseLabel =
      item.licenseType.charAt(0).toUpperCase() + item.licenseType.slice(1);

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: beat.title,
          description: `${licenseLabel} License`,
          images: beat.coverImage ? [beat.coverImage] : [],
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: 1,
    });

    orderItems.push({
      beatId: item.beatId,
      licenseType: item.licenseType.toUpperCase(),
      price,
    });
  }

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      buyerId: profile.id,
      totalAmount: orderItems.reduce((sum, i) => sum + i.price, 0),
      status: "PENDING",
      items: {
        create: orderItems.map((i) => ({
          beatId: i.beatId,
          buyerId: profile.id,
          licenseType: i.licenseType as any,
          price: i.price,
        })),
      },
    },
  });

  // Create Stripe Checkout Session
  const origin = getRequestURL(event).origin;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/cart`,
    metadata: {
      orderId: order.id,
    },
  });

  // Save session ID on order
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return { url: session.url };
});
