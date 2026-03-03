import { useAudioStore, type Track } from "@/stores/audio";

/**
 * Simple composable to interact with the audio player
 * Makes it easy to play tracks from anywhere in your app
 */
export const useAudioPlayer = () => {
  const audioStore = useAudioStore();

  /**
   * Play a track
   * @param track - Beat object with audio information
   */
  const play = (track: Track) => {
    audioStore.playTrack(track);
  };

  /**
   * Stop playback and clear the player
   */
  const stop = () => {
    audioStore.stop();
  };

  return {
    play,
    stop,
    // Access to current state
    currentTrack: computed(() => audioStore.currentTrack),
    isPlaying: computed(() => audioStore.isPlaying),
  };
};
