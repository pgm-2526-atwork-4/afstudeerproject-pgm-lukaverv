export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  if (user.isVerified) {
    throw createError({
      statusCode: 400,
      message: "User is already verified",
    });
  }

  // Use the utility function to send the verification email
  await sendVerificationEmail(user);

  return { message: "Verification email re-sent successfully" };
});
