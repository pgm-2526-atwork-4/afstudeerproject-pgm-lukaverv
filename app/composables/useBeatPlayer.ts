export function useBeatPlayer() {
  const playingBeatId = ref<number | null>(null);

  const togglePlay = (beatId: number) => {
    if (playingBeatId.value === beatId) {
      playingBeatId.value = null; // Pause
    } else {
      playingBeatId.value = beatId; // Play
    }
  };

  return {
    playingBeatId,
    togglePlay,
  };
}
