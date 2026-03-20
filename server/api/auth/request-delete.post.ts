import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event);

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
