import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface ResetTokenPayload {
  id: number;
  email: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token, password } = body;

  // Validate input
  if (!token || !password) {
    throw createError({
      statusCode: 400,
      message: "Token and password are required.",
    });
  }

  // Verify the token
  let payload: ResetTokenPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as ResetTokenPayload;
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired token.",
    });
  }

  // Find the user
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found." });
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: "Password has been reset successfully." };
});
