import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({ statusCode: 400, message: "Beat ID is required" });
    }

    // Auth check
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
        } catch {}
      }
    }

    if (!userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

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
      audioFile,
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
        ...(audioFile !== undefined && { audioFile }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return { success: true, beat: updated };
  } catch (error: any) {
    console.error("Beat update error:", error);
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: "Failed to update beat" });
  }
});
