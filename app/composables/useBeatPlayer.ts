import { useAudioStore, type Track } from "@/stores/audio";

export function useBeatPlayer() {
  const audioStore = useAudioStore();

  // Derived directly from the store so all components share the same state
  const playingBeatId = computed(() =>
    audioStore.currentTrack ? audioStore.currentTrack.id : null,
  );
  const isPlaying = computed(() => audioStore.isPlaying);

  function togglePlay(beat: any) {
    // If the same beat is already loaded, just toggle play/pause
    if (playingBeatId.value === String(beat.id)) {
      audioStore.setIsPlaying(!audioStore.isPlaying);
      return;
    }

    // Otherwise load and auto-play the new beat
    const track: Track = {
      id: String(beat.id),
      title: beat.title,
      producer: beat.producer,
      producerId: beat.producerUserId,
      audioUrl: beat.audioUrl ?? beat.audioFile,
      coverImage: beat.coverImage,
      duration: beat.durationSeconds ?? 0,
    };

    audioStore.playTrack(track);
  }

  return { playingBeatId, isPlaying, togglePlay };
}
