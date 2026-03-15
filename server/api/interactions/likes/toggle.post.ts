export default defineEventHandler(async (event) => {
  const { beatId, profileId } = await readBody(event);

  // Validate required fields
  if (!beatId || !profileId) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields: beatId and profileId",
    });
  }

  try {
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        profileId_beatId: {
          profileId,
          beatId,
        },
      },
    });

    if (existingLike) {
      // Unlike: delete the existing like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return {
        liked: false,
        message: "Beat unliked successfully",
      };
    } else {
      // Like: create a new like
      await prisma.like.create({
        data: {
          profileId,
          beatId,
        },
      });

      // Create notification for the beat producer (deduplicated)
      try {
        const beat = await prisma.beat.findUnique({
          where: { id: beatId },
          select: { producerId: true },
        });
        if (beat && beat.producerId !== profileId) {
          const existing = await prisma.notification.findFirst({
            where: {
              recipientId: beat.producerId,
              actorId: profileId,
              type: "LIKE",
              beatId,
            },
          });
          if (!existing) {
            await prisma.notification.create({
              data: {
                recipientId: beat.producerId,
                actorId: profileId,
                type: "LIKE",
                beatId,
              },
            });
          } else {
            // Reset to unread so the producer sees it again
            await prisma.notification.update({
              where: { id: existing.id },
              data: { isRead: false, createdAt: new Date() },
            });
          }
        }
      } catch (e) {
        console.error("Failed to create like notification:", e);
      }

      return {
        liked: true,
        message: "Beat liked successfully",
      };
    }
  } catch (error: any) {
    console.error("Like toggle error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to toggle like",
    });
  }
});
