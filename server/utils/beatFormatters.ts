/**
 * Type for beat with producer info and counts from Prisma
 */
type BeatWithProducerAndCounts = {
  id: string;
  title: string;
  description?: string | null;
  bpm: number;
  key?: string | null;
  genre: string;
  tags: string[];
  priceBasic: number;
  pricePremium: number;
  priceExclusive: number;
  duration: number;
  coverImage?: string | null;
  audioFileMp3?: string | null;
  audioFileWav?: string | null;
  isPublished?: boolean;
  isExclusiveSold?: boolean;
  createdAt?: Date;
  producer: {
    id: string;
    userId: string;
    username: string;
  };
  _count?: {
    likes: number;
    comments: number;
    plays?: number;
    orderItems?: number;
  };
};

/**
 * Format a single beat for API response
 * Includes all possible fields that might be needed
 */
export function formatBeatResponse(beat: BeatWithProducerAndCounts) {
  const formattedDuration = formatDuration(beat.duration);

  return {
    id: beat.id,
    title: beat.title,
    producer: beat.producer.username,
    producerId: beat.producer.id,
    producerUserId: beat.producer.userId,
    bpm: beat.bpm,
    key: beat.key,
    genre: beat.genre,
    tags: beat.tags,
    ...(beat.description !== undefined && { description: beat.description }),
    price: beat.priceBasic,
    priceBasic: beat.priceBasic,
    pricePremium: beat.pricePremium,
    priceExclusive: beat.priceExclusive,
    duration: formattedDuration,
    durationSeconds: beat.duration,
    coverImage: beat.coverImage,
    audioUrl: beat.audioFileMp3,
    ...(beat.audioFileWav && { audioUrlWav: beat.audioFileWav }),
    ...(beat.isPublished !== undefined && { isPublished: beat.isPublished }),
    ...(beat.isExclusiveSold !== undefined && {
      isExclusiveSold: beat.isExclusiveSold,
    }),
    ...(beat.createdAt && { createdAt: beat.createdAt }),
    ...(beat._count && {
      likesCount: beat._count.likes,
      commentsCount: beat._count.comments,
      ...(beat._count.plays !== undefined && {
        playsCount: beat._count.plays,
      }),
      ...(beat._count.orderItems !== undefined && {
        soldCopies: beat._count.orderItems,
      }),
    }),
  };
}

/**
 * Format an array of beats for API response
 */
export function formatBeatsResponse(beats: BeatWithProducerAndCounts[]) {
  return beats.map((beat) => formatBeatResponse(beat));
}
