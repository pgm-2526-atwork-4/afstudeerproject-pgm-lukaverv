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

    await prisma.beat.delete({ where: { id } });

    return { success: true };
  } catch (error: any) {
    console.error("Beat delete error:", error);
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, message: "Failed to delete beat" });
  }
});
