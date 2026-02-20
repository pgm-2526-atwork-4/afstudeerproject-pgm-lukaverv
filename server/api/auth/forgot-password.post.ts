import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);
    const { email } = body;

    // Validate email
    if (!email) {
      throw createError({ statusCode: 400, message: "Email is required." });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw createError({ statusCode: 404, message: "User not found." });
    }

    // Generate a secure reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" }, // Token expires in 15 minutes
    );

    // Send the reset email
    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetLink);

    // Return success response
    return { message: "Password reset link sent to your email." };
  } catch (error: any) {
    // Handle errors
    return sendError(event, error);
  }
});
