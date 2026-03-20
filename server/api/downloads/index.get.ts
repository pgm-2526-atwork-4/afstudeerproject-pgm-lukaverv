export default defineEventHandler(async (event) => {
  const profileId = await requireAuthProfileId(event);

  // Get all completed order items for this user
  const orderItems = await prisma.orderItem.findMany({
    where: {
      buyerId: profileId,
      order: { status: "COMPLETED" },
    },
    include: {
      beat: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          audioFileMp3: true,
          audioFileWav: true,
          bpm: true,
          key: true,
          genre: true,
          producer: {
            select: { username: true },
          },
        },
      },
      order: {
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orderItems.map((item) => ({
    id: item.id,
    beatId: item.beatId,
    title: item.beat.title,
    coverImage: item.beat.coverImage,
    producer: item.beat.producer.username,
    licenseType: item.licenseType,
    price: item.price,
    purchasedAt: item.order.createdAt,
    bpm: item.beat.bpm,
    key: item.beat.key,
    genre: item.beat.genre,
    // File URLs - the actual audio file serves as MP3
    // In a production app, you'd have separate WAV files stored
    files: getFilesForLicense(
      item.licenseType,
      item.beat.audioFileMp3,
      item.beat.audioFileWav,
    ),
  }));
});

function getFilesForLicense(
  licenseType: string,
  audioFileMp3: string,
  audioFileWav: string,
) {
  switch (licenseType) {
    case "BASIC":
      return [{ type: "MP3", url: audioFileMp3 }];
    case "PREMIUM":
      return [
        { type: "MP3", url: audioFileMp3 },
        { type: "WAV", url: audioFileWav },
      ];
    case "EXCLUSIVE":
      return [
        { type: "MP3", url: audioFileMp3 },
        { type: "WAV", url: audioFileWav },
      ];
    default:
      return [{ type: "MP3", url: audioFileMp3 }];
  }
}
