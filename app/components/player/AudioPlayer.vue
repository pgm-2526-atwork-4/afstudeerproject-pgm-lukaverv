<template>
  <ClientOnly>
    <Transition name="player-slide">
      <div
        v-if="audioStore.currentTrack"
        class="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1f35] border-t border-gray-700/40 px-3 md:px-4 py-2 md:py-3"
      >
        <!-- Desktop layout -->
        <div class="hidden md:flex items-center gap-3 max-w-screen-2xl mx-auto">
          <!-- LEFT — Cover + Track Info + Like + Controls -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <img
              :src="audioStore.currentTrack.coverImage"
              :alt="audioStore.currentTrack.title"
              class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div class="min-w-0 w-36">
              <NuxtLink
                :to="`/beat/${audioStore.currentTrack.id}`"
                class="text-white text-sm font-semibold truncate block hover:underline"
              >
                {{ audioStore.currentTrack.title }}
              </NuxtLink>
              <NuxtLink
                :to="`/profile/${audioStore.currentTrack.producerId}`"
                class="text-gray-400 text-xs truncate block hover:text-white transition"
              >
                {{ audioStore.currentTrack.producer }}
              </NuxtLink>
            </div>
            <!-- Like/Heart Button -->
            <button
              v-if="userProfile"
              @click="toggleLike"
              class="text-gray-400 hover:text-red-400 transition flex-shrink-0 -ml-1"
              :class="{ 'text-red-500': isLiked }"
              title="Like"
            >
              <Icon :name="isLiked ? 'ph:heart-fill' : 'ph:heart'" size="24" />
            </button>

            <!-- Playback Controls -->
            <div class="flex items-center gap-2">
              <button
                @click="playPrevious"
                :disabled="!hasPrevious || isLoading"
                class="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous track"
              >
                <Icon name="ph:skip-back-fill" size="18" />
              </button>
              <button
                @click="togglePlayPause"
                class="w-8 h-8 rounded-full bg-white hover:bg-gray-200 transition flex items-center justify-center flex-shrink-0"
              >
                <Icon
                  :name="
                    audioStore.isPlaying ? 'ph:pause-fill' : 'ph:play-fill'
                  "
                  size="16"
                  class="text-[#1a1f35]"
                  :class="audioStore.isPlaying ? '' : 'ml-0.5'"
                />
              </button>
              <button
                @click="playNext"
                :disabled="!hasNext || isLoading"
                class="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next track"
              >
                <Icon name="ph:skip-forward-fill" size="18" />
              </button>
            </div>
          </div>

          <!-- CENTER — Waveform Seekbar -->
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <span class="text-gray-400 text-xs w-8 text-right flex-shrink-0">
              {{ formatTime(currentTime) }}
            </span>

            <div
              ref="waveformRef"
              class="relative flex-1 h-10 cursor-pointer group"
              @click="seek"
              @mousemove="onHover"
              @mouseleave="hoverPercent = null"
            >
              <div class="absolute inset-0 flex items-center gap-[2px]">
                <div
                  v-for="i in 80"
                  :key="i"
                  class="flex-1 rounded-sm transition-all"
                  :class="
                    (i / 80) * 100 <= progress
                      ? 'bg-white'
                      : hoverPercent !== null && (i / 80) * 100 <= hoverPercent
                        ? 'bg-gray-400'
                        : 'bg-gray-600'
                  "
                  :style="{ height: getWaveHeight(i) + '%' }"
                />
              </div>
              <div
                class="absolute top-0 bottom-0 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-100 transition"
                :style="{ left: progress + '%' }"
              />
            </div>

            <span class="text-gray-400 text-xs w-8 flex-shrink-0">
              {{
                formatTime(actualDuration || audioStore.currentTrack.duration)
              }}
            </span>
          </div>

          <!-- RIGHT — Volume + Close -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="toggleMute"
              class="text-gray-400 hover:text-white transition"
            >
              <Icon
                :name="
                  muted || volume === 0
                    ? 'ph:speaker-x'
                    : volume < 50
                      ? 'ph:speaker-low'
                      : 'ph:speaker-high'
                "
                size="18"
              />
            </button>
            <input
              v-model.number="volume"
              type="range"
              min="0"
              max="100"
              @input="onVolumeChange"
              class="w-20 accent-white cursor-pointer"
            />
            <button
              @click="closePlayer"
              class="text-gray-400 hover:text-white transition ml-1"
              title="Close player"
            >
              <Icon name="ph:x" size="18" />
            </button>
          </div>
        </div>

        <!-- Mobile layout -->
        <div class="md:hidden space-y-2">
          <!-- Top row: Info + Controls + Close -->
          <div class="flex items-center gap-2">
            <img
              :src="audioStore.currentTrack.coverImage"
              :alt="audioStore.currentTrack.title"
              class="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
            <div class="min-w-0 flex-1">
              <NuxtLink
                :to="`/beat/${audioStore.currentTrack.id}`"
                class="text-white text-xs font-semibold truncate block hover:underline"
              >
                {{ audioStore.currentTrack.title }}
              </NuxtLink>
              <NuxtLink
                :to="`/profile/${audioStore.currentTrack.producerId}`"
                class="text-gray-400 text-[10px] truncate block hover:text-white transition"
              >
                {{ audioStore.currentTrack.producer }}
              </NuxtLink>
            </div>
            <!-- Like -->
            <button
              v-if="userProfile"
              @click="toggleLike"
              class="text-gray-400 hover:text-red-400 transition flex-shrink-0"
              :class="{ 'text-red-500': isLiked }"
            >
              <Icon :name="isLiked ? 'ph:heart-fill' : 'ph:heart'" size="18" />
            </button>
            <!-- Controls -->
            <div class="flex items-center gap-1.5">
              <button
                @click="playPrevious"
                :disabled="!hasPrevious || isLoading"
                class="text-gray-400 hover:text-white transition disabled:opacity-30"
              >
                <Icon name="ph:skip-back-fill" size="16" />
              </button>
              <button
                @click="togglePlayPause"
                class="w-7 h-7 rounded-full bg-white hover:bg-gray-200 transition flex items-center justify-center flex-shrink-0"
              >
                <Icon
                  :name="
                    audioStore.isPlaying ? 'ph:pause-fill' : 'ph:play-fill'
                  "
                  size="14"
                  class="text-[#1a1f35]"
                  :class="audioStore.isPlaying ? '' : 'ml-0.5'"
                />
              </button>
              <button
                @click="playNext"
                :disabled="!hasNext || isLoading"
                class="text-gray-400 hover:text-white transition disabled:opacity-30"
              >
                <Icon name="ph:skip-forward-fill" size="16" />
              </button>
            </div>
            <!-- Volume toggle -->
            <button
              @click="toggleMute"
              class="text-gray-400 hover:text-white transition flex-shrink-0"
            >
              <Icon
                :name="
                  muted || volume === 0
                    ? 'ph:speaker-x'
                    : volume < 50
                      ? 'ph:speaker-low'
                      : 'ph:speaker-high'
                "
                size="16"
              />
            </button>
            <!-- Close -->
            <button
              @click="closePlayer"
              class="text-gray-400 hover:text-white transition flex-shrink-0"
            >
              <Icon name="ph:x" size="16" />
            </button>
          </div>

          <!-- Bottom row: Waveform + Times -->
          <div class="flex items-center gap-1.5">
            <span
              class="text-gray-400 text-[10px] w-7 text-right flex-shrink-0"
            >
              {{ formatTime(currentTime) }}
            </span>
            <div
              ref="mobileWaveformRef"
              class="relative flex-1 h-8 cursor-pointer group"
              @click="seekMobile"
              @touchstart.passive="onTouchSeek"
              @touchmove.passive="onTouchSeek"
            >
              <div class="absolute inset-0 flex items-center gap-[1.5px]">
                <div
                  v-for="i in 60"
                  :key="i"
                  class="flex-1 rounded-sm transition-all"
                  :class="
                    (i / 60) * 100 <= progress ? 'bg-white' : 'bg-gray-600'
                  "
                  :style="{ height: getMobileWaveHeight(i) + '%' }"
                />
              </div>
            </div>
            <span class="text-gray-400 text-[10px] w-7 flex-shrink-0">
              {{
                formatTime(actualDuration || audioStore.currentTrack.duration)
              }}
            </span>
          </div>

          <!-- Volume slider (shown on mobile when tapped) -->
          <div v-if="showMobileVolume" class="flex items-center gap-2 px-1">
            <Icon
              name="ph:speaker-low"
              size="14"
              class="text-gray-400 flex-shrink-0"
            />
            <input
              v-model.number="volume"
              type="range"
              min="0"
              max="100"
              @input="onVolumeChange"
              class="flex-1 accent-white cursor-pointer"
            />
            <Icon
              name="ph:speaker-high"
              size="14"
              class="text-gray-400 flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Howl } from "howler";
import { useAudioStore, type Track } from "@/stores/audio";

const audioStore = useAudioStore();
const { generateWaveform } = useWaveform();

const currentTime = ref(0);
const actualDuration = ref(0);
const volume = ref(70);
const previousVolume = ref(70);
const muted = ref(false);
const hoverPercent = ref<number | null>(null);
const sound = ref<Howl | null>(null);
const waveformHeights = ref<number[]>([]);
const waveformRef = ref<HTMLElement | null>(null);
const mobileWaveformRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const showMobileVolume = ref(false);
const playRegistered = ref(false); // Track if play was registered for current track
const currentPlayId = ref<string | null>(null);
let rafId: number | null = null;
let soundId: number | null = null;

// Real accumulated listen time tracking (prevents gaming via seeking)
let accumulatedListenTime = 0;
let lastTickTime = 0;

// Likes state — shared reactive store across AudioPlayer and beat detail page
const userProfile = useState<any>("userProfile");
const currentBeatId = computed(() => audioStore.currentTrack?.id || "");
const { isLiked, toggleLike, fetchLikeStatus } = useLikes(currentBeatId);

const currentBeatIndex = computed(() => {
  if (!audioStore.playlist.length || !audioStore.currentTrack) return -1;
  return audioStore.playlist.findIndex(
    (b) => String(b.id) === audioStore.currentTrack?.id,
  );
});

const hasNext = computed(() => {
  if (!audioStore.playlist.length) return false;
  return (
    currentBeatIndex.value >= 0 &&
    currentBeatIndex.value < audioStore.playlist.length - 1
  );
});

const hasPrevious = computed(() => {
  return currentBeatIndex.value > 0;
});

function getWaveHeight(index: number): number {
  if (waveformHeights.value.length === 0) return 50;
  return waveformHeights.value[index % waveformHeights.value.length] ?? 50;
}

const progress = computed(() => {
  const duration = actualDuration.value || audioStore.currentTrack?.duration;
  if (!duration) return 0;
  return Math.min((currentTime.value / duration) * 100, 100);
});

let trackJustLoaded = false;

watch(
  () => audioStore.currentTrack,
  async (track: Track | null) => {
    // Send duration for the previous track before switching
    sendListenDuration();

    if (!track) {
      sound.value?.unload();
      sound.value = null;
      currentTime.value = 0;
      return;
    }
    trackJustLoaded = true;
    playRegistered.value = false; // Reset play registration for new track
    loadTrack(track);

    // Fetch like status for the new track
    if (userProfile.value?.id) {
      fetchLikeStatus();
    }
  },
);

watch(
  () => audioStore.isPlaying,
  (playing) => {
    if (trackJustLoaded) return;
    if (!sound.value) return;
    if (playing && !sound.value.playing(soundId ?? undefined)) {
      sound.value.play(soundId ?? undefined);
    } else if (!playing && sound.value.playing(soundId ?? undefined)) {
      sound.value.pause(soundId ?? undefined);
    }
  },
);

async function loadTrack(track: Track) {
  // Prevent loading multiple tracks simultaneously
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    sound.value?.unload();
    soundId = null;
    currentTime.value = 0;
    actualDuration.value = 0;
    // Reset for new track
    accumulatedListenTime = 0;
    lastTickTime = 0;
    currentPlayId.value = null; // Clear play ID when switching beats

    // Generate waveform using composable
    waveformHeights.value = await generateWaveform(track.audioUrl);

    sound.value = new Howl({
      src: [track.audioUrl],
      html5: true,
      volume: muted.value ? 0 : volume.value / 100,
      onload() {
        // Get actual duration from the loaded audio file
        if (sound.value) {
          actualDuration.value = sound.value.duration();
        }
      },
      onplay(id: number) {
        soundId = id;
        trackJustLoaded = false; // Reset here, after sound is actually playing
        audioStore.setIsPlaying(true);
        // Register play immediately (5min cooldown enforced by API)
        if (!playRegistered.value && audioStore.currentTrack) {
          playRegistered.value = true;
          registerPlay(audioStore.currentTrack.id);
        }
        tick();
      },
      onpause() {
        audioStore.setIsPlaying(false);
        // Reset timestamp so pause time isn't included in duration
        lastTickTime = 0;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      onend() {
        audioStore.setIsPlaying(false);
        sendListenDuration();
        currentTime.value = 0;
        // Auto-play next track
        if (hasNext.value) {
          playNext();
        }
      },
    });

    sound.value.play();
  } catch (error) {
    // Failed to load track
  } finally {
    isLoading.value = false;
  }
}

function tick() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (!sound.value) return;

  currentTime.value = (sound.value.seek(soundId ?? undefined) as number) ?? 0;

  // Track real accumulated listening time (only when actually playing)
  if (audioStore.isPlaying) {
    const now = Date.now();
    if (lastTickTime > 0) {
      const elapsed = (now - lastTickTime) / 1000; // convert ms to seconds
      accumulatedListenTime += elapsed;
    }
    lastTickTime = now;
  }

  if (audioStore.isPlaying) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = null;
  }
}

async function registerPlay(beatId: string) {
  try {
    const res = await $fetch<{ playId: string }>(
      "/api/interactions/plays/plays",
      {
        method: "POST",
        body: { beatId },
      },
    );
    currentPlayId.value = res.playId;
  } catch (error) {
    // Silently fail - don't interrupt user experience
  }
}

async function sendListenDuration() {
  if (!currentPlayId.value || accumulatedListenTime <= 0) return;
  const playId = currentPlayId.value;
  const duration = Math.floor(accumulatedListenTime);
  // Keep currentPlayId - allows updating same play if user replays within cooldown
  try {
    await $fetch(`/api/interactions/plays/${playId}`, {
      method: "PATCH",
      body: { listenDuration: duration },
    });
  } catch {
    // Silently fail
  }
}

function togglePlayPause() {
  if (!sound.value) return;
  audioStore.setIsPlaying(!audioStore.isPlaying);
}

function seek(e: MouseEvent) {
  if (!sound.value || !audioStore.currentTrack || !waveformRef.value) return;

  const rect = waveformRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const duration = actualDuration.value || audioStore.currentTrack.duration;
  const time = percentage * duration;

  sound.value.seek(time, soundId ?? undefined);
  currentTime.value = time; // Immediately update for visual feedback
  // Reset accumulated time when user seeks (prevents gaming)
  accumulatedListenTime = 0;
  lastTickTime = 0;
  // Always restart tick loop so waveform + timer continue updating
  tick();
}

function onHover(e: MouseEvent) {
  if (!waveformRef.value) return;
  const rect = waveformRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  hoverPercent.value = Math.max(0, Math.min(100, (x / rect.width) * 100));
}

function getMobileWaveHeight(index: number): number {
  if (waveformHeights.value.length === 0) return 50;
  // Map 60 bars to the 80-bar waveform data
  const mappedIndex = Math.floor((index / 60) * waveformHeights.value.length);
  return (
    waveformHeights.value[mappedIndex % waveformHeights.value.length] ?? 50
  );
}

function seekMobile(e: MouseEvent) {
  if (!sound.value || !audioStore.currentTrack || !mobileWaveformRef.value)
    return;
  const rect = mobileWaveformRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const duration = actualDuration.value || audioStore.currentTrack.duration;
  const time = percentage * duration;
  sound.value.seek(time, soundId ?? undefined);
  currentTime.value = time;
  // Reset accumulated time when user seeks (prevents gaming)
  accumulatedListenTime = 0;
  lastTickTime = 0;
  tick();
}

function onTouchSeek(e: TouchEvent) {
  if (!sound.value || !audioStore.currentTrack || !mobileWaveformRef.value)
    return;
  const touch = e.touches[0];
  if (!touch) return;
  const rect = mobileWaveformRef.value.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const duration = actualDuration.value || audioStore.currentTrack.duration;
  const time = percentage * duration;
  sound.value.seek(time, soundId ?? undefined);
  currentTime.value = time;
  // Reset accumulated time when user seeks (prevents gaming)
  accumulatedListenTime = 0;
  lastTickTime = 0;
  tick();
}

function playNext() {
  if (!hasNext.value || !audioStore.playlist.length || isLoading.value) return;
  const nextBeat = audioStore.playlist[currentBeatIndex.value + 1];
  if (nextBeat) {
    const track: Track = {
      id: String(nextBeat.id),
      title: nextBeat.title,
      producer: nextBeat.producer,
      producerId: nextBeat.producerUserId,
      audioUrl: nextBeat.audioUrl,
      coverImage: nextBeat.coverImage,
      duration: nextBeat.durationSeconds || 0,
    };
    audioStore.playTrack(track);
  }
}

function playPrevious() {
  if (!hasPrevious.value || !audioStore.playlist.length || isLoading.value)
    return;
  const prevBeat = audioStore.playlist[currentBeatIndex.value - 1];
  if (prevBeat) {
    const track: Track = {
      id: String(prevBeat.id),
      title: prevBeat.title,
      producer: prevBeat.producer,
      producerId: prevBeat.producerUserId,
      audioUrl: prevBeat.audioUrl,
      coverImage: prevBeat.coverImage,
      duration: prevBeat.durationSeconds || 0,
    };
    audioStore.playTrack(track);
  }
}

function onVolumeChange() {
  // If user manually adjusts volume from 0, unmute
  if (muted.value && volume.value > 0) {
    muted.value = false;
  }
  // Store as previous volume if not 0
  if (volume.value > 0) {
    previousVolume.value = volume.value;
  }
  sound.value?.volume(volume.value / 100);
}

function toggleMute() {
  // On mobile, toggle volume slider visibility
  if (window.innerWidth < 768) {
    showMobileVolume.value = !showMobileVolume.value;
    return;
  }
  if (muted.value) {
    // Unmuting - restore previous volume
    muted.value = false;
    volume.value = previousVolume.value;
    sound.value?.volume(volume.value / 100);
  } else {
    // Muting - store current volume and set to 0
    muted.value = true;
    previousVolume.value = volume.value;
    volume.value = 0;
    sound.value?.volume(0);
  }
}

function closePlayer() {
  sendListenDuration();
  sound.value?.stop();
  sound.value?.unload();
  audioStore.stop();
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

onUnmounted(() => {
  sendListenDuration();
  if (rafId !== null) cancelAnimationFrame(rafId);
  sound.value?.unload();
});
</script>

<style scoped>
.player-slide-enter-active,
.player-slide-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.player-slide-enter-from,
.player-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
