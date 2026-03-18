import jwt from "jsonwebtoken";
import { getToken } from "#auth";

async function getUserId(event: any): Promise<string | null> {
  const token = await getToken({ event });
  if (token?.email) {
    const user = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: { id: true },
    });
    if (user) return user.id;
  }

  const authToken = getCookie(event, "auth_token");
  if (authToken) {
    try {
      const decoded = jwt.verify(
        authToken,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { id: string };
      return decoded.id;
    } catch {}
  }

  return null;
}

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event);
  if (!userId) throw createError({ statusCode: 401, message: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) throw createError({ statusCode: 404, message: "User not found" });

  // Stateless JWT — no DB changes needed
  const deleteToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" },
  );

  const appUrl =
    process.env.APP_URL ||
    process.env.BASE_URL ||
    process.env.NUXT_AUTH_ORIGIN ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  await sendDeleteAccountEmail(
    user.email,
    `${appUrl}/auth/delete-account?token=${deleteToken}`,
  );

  return { message: "Confirmation email sent. Check your inbox." };
});
