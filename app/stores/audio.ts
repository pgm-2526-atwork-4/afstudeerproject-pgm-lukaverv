// Track interface - defines what a track looks like
export interface Track {
  id: string;
  title: string;
  producer: string;
  producerId: string;
  audioUrl: string;
  coverImage: string;
  duration: number; // in seconds
}

// Audio store - manages which track is playing and if it's playing or paused
export const useAudioStore = defineStore("audio", {
  state: () => ({
    currentTrack: null as Track | null, // The track currently loaded
    isPlaying: false, // Whether audio is currently playing
    playlist: [] as any[], // Current context playlist (beats from current page)
  }),

  actions: {
    // Play a new track
    playTrack(track: Track) {
      this.currentTrack = track;
      this.isPlaying = true;
    },

    // Set playing state (play/pause)
    setIsPlaying(playing: boolean) {
      this.isPlaying = playing;
    },

    // Stop and clear current track
    stop() {
      this.currentTrack = null;
      this.isPlaying = false;
    },

    // Set the current playlist from the active page
    setPlaylist(beats: any[]) {
      this.playlist = beats || [];
    },
  },
});
