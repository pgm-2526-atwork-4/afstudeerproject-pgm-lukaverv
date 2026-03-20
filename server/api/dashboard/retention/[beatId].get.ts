export default defineEventHandler(async (event) => {
  const beatId = getRouterParam(event, "beatId");
  if (!beatId) {
    throw createError({ statusCode: 400, message: "Beat ID is required" });
  }

  const userId = await requireAuthUserId(event);

  // Get the beat and verify ownership
  const beat = await prisma.beat.findUnique({
    where: { id: beatId },
    select: { id: true, duration: true, producerId: true },
  });
  if (!beat) {
    throw createError({ statusCode: 404, message: "Beat not found" });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile || profile.id !== beat.producerId) {
    throw createError({ statusCode: 403, message: "Not your beat" });
  }

  const beatDuration = beat.duration; // total duration in seconds

  // Get all plays with listen duration for this beat
  const plays = await prisma.play.findMany({
    where: { beatId, listenDuration: { not: null } },
    select: { listenDuration: true },
  });

  // Get all plays with listen duration for ALL beats by this producer (for typical retention)
  const allProducerPlays = await prisma.play.findMany({
    where: {
      beat: { producerId: profile.id },
      listenDuration: { not: null },
    },
    select: { listenDuration: true, beat: { select: { duration: true } } },
  });

  const POINTS = 50;

  // Build this beat's retention curve
  const beatRetention = buildRetentionCurve(plays, beatDuration, POINTS);

  // Build typical retention curve (all producer's tracks, normalized by each track's duration)
  const typicalRetention = buildTypicalRetention(allProducerPlays, POINTS);

  // Compute average listen duration and percentage
  let avgDurationSeconds = 0;
  let avgPercentage = 0;
  if (plays.length > 0) {
    const totalListened = plays.reduce(
      (sum, p) => sum + (p.listenDuration ?? 0),
      0,
    );
    avgDurationSeconds = Math.round(totalListened / plays.length);
    avgPercentage =
      beatDuration > 0
        ? Math.round((avgDurationSeconds / beatDuration) * 100)
        : 0;
  }

  const minutes = Math.floor(avgDurationSeconds / 60);
  const seconds = avgDurationSeconds % 60;
  const avgDurationFormatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return {
    beatRetention,
    typicalRetention,
    avgViewDuration: avgDurationFormatted,
    avgPercentageViewed: avgPercentage,
    totalPlays: plays.length,
    beatDuration,
  };
});

/** Build percentage-retained at each point along the track */
function buildRetentionCurve(
  plays: { listenDuration: number | null }[],
  trackDuration: number,
  points: number,
): number[] {
  if (plays.length === 0 || trackDuration <= 0) {
    return Array(points + 1).fill(0);
  }

  const curve: number[] = [];
  for (let i = 0; i <= points; i++) {
    const threshold = (i / points) * trackDuration;
    // How many listeners reached this point?
    const reached = plays.filter(
      (p) => (p.listenDuration ?? 0) >= threshold,
    ).length;
    curve.push(Math.round((reached / plays.length) * 100));
  }
  return curve;
}

/** Build typical retention across all producer tracks (normalized by each track's duration) */
function buildTypicalRetention(
  plays: { listenDuration: number | null; beat: { duration: number } }[],
  points: number,
): number[] {
  if (plays.length === 0) {
    return Array(points + 1).fill(0);
  }

  const curve: number[] = [];
  for (let i = 0; i <= points; i++) {
    const progressRatio = i / points;
    // For each play, did the listener reach this relative point in their track?
    const reached = plays.filter((p) => {
      const threshold = progressRatio * p.beat.duration;
      return (p.listenDuration ?? 0) >= threshold;
    }).length;
    curve.push(Math.round((reached / plays.length) * 100));
  }
  return curve;
}
