<template>
  <ClientOnly>
    <Transition name="player-slide">
      <div
        v-if="audioStore.currentTrack"
        class="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1f35] border-t border-gray-700/40 px-4 py-3"
      >
        <div class="flex items-center gap-4 max-w-screen-2xl mx-auto">
          <!-- LEFT — Cover + Track Info -->
          <div class="flex items-center gap-3 w-56 min-w-0 flex-shrink-0">
            <img
              :src="audioStore.currentTrack.coverImage"
              :alt="audioStore.currentTrack.title"
              class="w-11 h-11 rounded-lg object-cover flex-shrink-0"
            />
            <div class="min-w-0 flex-1">
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
              @click="toggleLike"
              class="text-gray-400 hover:text-red-400 transition flex-shrink-0"
              :class="{ 'text-red-500': isLiked }"
              title="Like"
            >
              <Icon :name="isLiked ? 'ph:heart-fill' : 'ph:heart'" size="20" />
            </button>
          </div>

          <!-- CENTER — Controls + Seekbar -->
          <div class="flex flex-col items-center gap-2 flex-1 min-w-0">
            <!-- Playback Buttons -->
            <div class="flex items-center gap-4">
              <!-- Previous Track -->
              <button
                @click="playPrevious"
                :disabled="!hasPrevious"
                class="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous track"
              >
                <Icon name="ph:skip-back-fill" size="20" />
              </button>

              <!-- Play / Pause -->
              <button
                @click="togglePlayPause"
                class="w-9 h-9 rounded-full bg-white hover:bg-gray-200 transition flex items-center justify-center flex-shrink-0"
              >
                <Icon
                  :name="
                    audioStore.isPlaying ? 'ph:pause-fill' : 'ph:play-fill'
                  "
                  size="18"
                  class="text-[#1a1f35]"
                  :class="audioStore.isPlaying ? '' : 'ml-0.5'"
                />
              </button>

              <!-- Next Track -->
              <button
                @click="playNext"
                :disabled="!hasNext"
                class="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next track"
              >
                <Icon name="ph:skip-forward-fill" size="20" />
              </button>
            </div>

            <!-- Seekbar + Times -->
            <div class="flex items-center gap-2 w-full">
              <span class="text-gray-400 text-xs w-8 text-right flex-shrink-0">
                {{ formatTime(currentTime) }}
              </span>

              <!-- Waveform seekbar -->
              <div
                ref="waveformRef"
                class="relative flex-1 h-10 cursor-pointer group"
                @click="seek"
                @mousemove="onHover"
                @mouseleave="hoverPercent = null"
              >
                <!-- Waveform bars -->
                <div class="absolute inset-0 flex items-center gap-[2px]">
                  <div
                    v-for="i in 80"
                    :key="i"
                    class="flex-1 rounded-sm transition-all"
                    :class="
                      (i / 80) * 100 <= progress
                        ? 'bg-white'
                        : hoverPercent !== null &&
                            (i / 80) * 100 <= hoverPercent
                          ? 'bg-gray-400'
                          : 'bg-gray-600'
                    "
                    :style="{ height: getWaveHeight(i) + '%' }"
                  />
                </div>
                <!-- Scrubber line -->
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
          </div>

          <!-- RIGHT — Volume -->
          <div
            class="hidden md:flex items-center gap-2 w-32 flex-shrink-0 justify-end"
          >
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
          </div>

          <!-- Close Button -->
          <button
            @click="closePlayer"
            class="text-gray-400 hover:text-white transition ml-2"
            title="Close player"
          >
            <Icon name="ph:x" size="20" />
          </button>
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
const isLiked = ref(false); // Like/heart button state
let rafId: number | null = null;
let soundId: number | null = null;

// Fetch all beats for next/previous functionality
const { data: allBeats } = await useFetch("/api/beats");

const currentBeatIndex = computed(() => {
  if (!allBeats.value || !audioStore.currentTrack) return -1;
  return allBeats.value.findIndex(
    (b) => String(b.id) === audioStore.currentTrack?.id,
  );
});

const hasNext = computed(() => {
  if (!allBeats.value) return false;
  return (
    currentBeatIndex.value >= 0 &&
    currentBeatIndex.value < allBeats.value.length - 1
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
  (track: Track | null) => {
    if (!track) {
      sound.value?.unload();
      sound.value = null;
      currentTime.value = 0;
      return;
    }
    trackJustLoaded = true;
    loadTrack(track);
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
  sound.value?.unload();
  soundId = null;
  currentTime.value = 0;
  actualDuration.value = 0;

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
      tick();
    },
    onpause() {
      audioStore.setIsPlaying(false);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    onend() {
      audioStore.setIsPlaying(false);
      currentTime.value = 0;
      // Auto-play next track
      if (hasNext.value) {
        playNext();
      }
    },
  });

  sound.value.play();
}

function tick() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (!sound.value) return;
  currentTime.value = (sound.value.seek(soundId ?? undefined) as number) ?? 0;
  if (audioStore.isPlaying) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = null;
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
  // Always restart tick loop so waveform + timer continue updating
  tick();
}

function onHover(e: MouseEvent) {
  if (!waveformRef.value) return;
  const rect = waveformRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  hoverPercent.value = Math.max(0, Math.min(100, (x / rect.width) * 100));
}

function playNext() {
  if (!hasNext.value || !allBeats.value) return;
  const nextBeat = allBeats.value[currentBeatIndex.value + 1];
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
  if (!hasPrevious.value || !allBeats.value) return;
  const prevBeat = allBeats.value[currentBeatIndex.value - 1];
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
  sound.value?.stop();
  sound.value?.unload();
  audioStore.stop();
}

function toggleLike() {
  // TODO: Implement like functionality (save to favorites, API call, etc.)
  isLiked.value = !isLiked.value;
  console.log("Like toggled:", isLiked.value);
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

onUnmounted(() => {
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
