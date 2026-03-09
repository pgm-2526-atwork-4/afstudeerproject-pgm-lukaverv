<template>
  <div
    class="min-h-screen pt-16 bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <div class="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <BackButton label="Back" class="mb-4" />
        <h1 class="text-4xl font-bold text-white mb-2">Upload a Beat</h1>
        <p class="text-gray-400">
          Fill in the details and upload your beat to the marketplace
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="flex gap-8 items-start">
          <!-- Left: scrollable -->
          <div class="flex-1 min-w-0 space-y-6">
            <!-- Basic Info -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-6 shadow-xl"
            >
              <h2 class="text-lg font-bold text-white mb-5">Basic Info</h2>
              <div class="flex gap-5 items-stretch">
                <!-- Beat Cover -->
                <div class="flex-shrink-0 flex flex-col">
                  <p class="text-xs font-medium text-gray-400 mb-2">
                    Beat cover
                  </p>
                  <div
                    class="flex-1 w-48 rounded-xl border-2 border-dashed border-gray-600 bg-[#0d1230] flex flex-col items-center justify-center gap-2 text-gray-500 cursor-pointer hover:border-blue-500 transition-colors min-h-[8rem] overflow-hidden"
                    @click="handleBeatCoverUpload"
                  >
                    <img
                      v-if="beatCoverUrl"
                      :src="beatCoverUrl"
                      alt="Beat cover"
                      class="w-full h-full object-cover"
                    />
                    <template v-else>
                      <Icon name="ph:image" class="w-8 h-8" />
                      <p class="text-xs">Click to upload</p>
                    </template>
                  </div>
                </div>

                <!-- Title + Description -->
                <div class="flex-1 flex flex-col gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Title</label
                    >
                    <InputCharCount :current="title.length" :max="80">
                      <input
                        v-model="title"
                        type="text"
                        placeholder="Beat title"
                        :maxlength="80"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </InputCharCount>
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs font-medium text-gray-400 mb-1"
                      >Description</label
                    >
                    <InputCharCount
                      :current="description.length"
                      :max="300"
                      position="bottom"
                    >
                      <textarea
                        v-model="description"
                        placeholder="Describe your beat..."
                        rows="4"
                        :maxlength="300"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 pb-7 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </InputCharCount>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-6 shadow-xl"
            >
              <h2 class="text-lg font-bold text-white mb-5">Metadata</h2>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >Key</label
                  >
                  <select
                    v-model="selectedKey"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select key</option>
                    <option v-for="key in musicalKeys" :key="key" :value="key">
                      {{ key }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1"
                    >BPM</label
                  >
                  <input
                    v-model.number="bpm"
                    type="number"
                    placeholder="140"
                    min="40"
                    max="300"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-xs font-medium text-gray-400 mb-1"
                  >Genre</label
                >
                <select
                  v-model="selectedGenre"
                  class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select genre</option>
                  <option v-for="genre in genres" :key="genre" :value="genre">
                    {{ genre }}
                  </option>
                </select>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-medium text-gray-400">Tags</label>
                  <span class="text-xs text-gray-500">{{ tags.length }}/3</span>
                </div>
                <!-- Tag chips -->
                <div v-if="tags.length" class="flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="(tag, i) in tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 bg-blue-600/20 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    #{{ tag }}
                    <button
                      type="button"
                      @click="removeTag(i)"
                      class="hover:text-white transition-colors"
                    >
                      <Icon name="ph:x-bold" class="w-3 h-3" />
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    v-model="tagInput"
                    type="text"
                    placeholder="Add a tag..."
                    :disabled="tags.length >= 3"
                    class="flex-1 bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    @keydown.enter.prevent="addTag"
                  />
                  <button
                    type="button"
                    :disabled="tags.length >= 3 || !tagInput.trim()"
                    class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    @click="addTag"
                  >
                    Add
                  </button>
                </div>
                <p v-if="tags.length >= 3" class="text-xs text-gray-500 mt-1">
                  Maximum of 3 tags reached.
                </p>
              </div>
            </div>

            <!-- Pricing -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-6 shadow-xl"
            >
              <h2 class="text-lg font-bold text-white mb-5">Pricing</h2>
              <div class="space-y-3">
                <div class="flex items-center gap-4">
                  <div class="w-28 text-sm text-gray-300">Basic</div>
                  <div class="relative flex-1">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >€</span
                    >
                    <input
                      v-model.number="priceBasic"
                      type="number"
                      placeholder="29.99"
                      min="0"
                      step="0.01"
                      class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-28 text-sm text-gray-300">Premium</div>
                  <div class="relative flex-1">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >€</span
                    >
                    <input
                      v-model.number="pricePremium"
                      type="number"
                      placeholder="59.99"
                      min="0"
                      step="0.01"
                      class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-28 text-sm text-gray-300">Exclusive</div>
                  <div class="relative flex-1">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >€</span
                    >
                    <input
                      v-model.number="priceExclusive"
                      type="number"
                      placeholder="299.99"
                      min="0"
                      step="0.01"
                      class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: sticky sidebar -->
          <div class="w-80 flex-shrink-0 sticky top-20 self-start space-y-4">
            <!-- Audio Files -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-5 shadow-xl"
            >
              <h2 class="text-sm font-bold text-white mb-4">Audio Files</h2>

              <!-- WAV Untagged -->
              <div class="mb-3">
                <p class="text-xs font-medium text-gray-400 mb-1.5">
                  WAV <span class="text-gray-500">(untagged)</span>
                </p>
                <div
                  class="flex items-center gap-3 bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500 transition-colors"
                  :class="wavUrl ? 'border-green-600' : ''"
                  @click="handleWavUpload"
                >
                  <Icon
                    name="ph:waveform"
                    class="w-5 h-5 flex-shrink-0"
                    :class="wavUrl ? 'text-green-400' : 'text-gray-400'"
                  />
                  <span
                    class="flex-1 text-sm truncate"
                    :class="wavUrl ? 'text-green-400' : 'text-gray-400'"
                  >
                    {{ wavUrl ? "WAV uploaded ✓" : "Upload WAV file" }}
                  </span>
                  <Icon name="ph:upload-simple" class="w-4 h-4 text-gray-500" />
                </div>
                <p class="text-xs text-gray-600 mt-1">WAV only, max 100 MB</p>
              </div>

              <!-- MP3 Tagged -->
              <div>
                <p class="text-xs font-medium text-gray-400 mb-1.5">
                  MP3 <span class="text-gray-500">(tagged)</span>
                </p>
                <div
                  class="flex items-center gap-3 bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500 transition-colors"
                  :class="mp3Url ? 'border-green-600' : ''"
                  @click="handleMp3Upload"
                >
                  <Icon
                    name="ph:music-note"
                    class="w-5 h-5 flex-shrink-0"
                    :class="mp3Url ? 'text-green-400' : 'text-gray-400'"
                  />
                  <span
                    class="flex-1 text-sm truncate"
                    :class="mp3Url ? 'text-green-400' : 'text-gray-400'"
                  >
                    {{ mp3Url ? "MP3 uploaded ✓" : "Upload MP3 file" }}
                  </span>
                  <Icon name="ph:upload-simple" class="w-4 h-4 text-gray-500" />
                </div>
                <p class="text-xs text-gray-600 mt-1">MP3 only, max 50 MB</p>
              </div>
            </div>

            <!-- Visibility -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-5 shadow-xl"
            >
              <h2 class="text-sm font-bold text-white mb-3">Visibility</h2>
              <select
                v-model="isPublished"
                class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option :value="false">Private</option>
                <option :value="true">Public</option>
              </select>
              <p class="text-xs text-gray-500 mt-2">
                Private beats are only visible to you.
              </p>
            </div>

            <!-- Publish -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? "Publishing..." : "Publish Beat" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { musicalKeys, genres } from "~/data/filterData";

useHead({
  script: [
    {
      src: "https://upload-widget.cloudinary.com/global/all.js",
      defer: true,
    },
  ],
});

definePageMeta({
  middleware: "producer-only",
});

const config = useRuntimeConfig();
const { openUploadWidget } = useCloudinaryUpload();

const beatCoverUrl = ref("");
const wavUrl = ref("");
const mp3Url = ref("");
const title = ref("");
const description = ref("");
const selectedKey = ref("");
const bpm = ref<number | null>(null);
const selectedGenre = ref("");
const tagInput = ref("");
const tags = ref<string[]>([]);
const priceBasic = ref<number | null>(null);
const pricePremium = ref<number | null>(null);
const priceExclusive = ref<number | null>(null);
const isPublished = ref(true);
const loading = ref(false);

const handleBeatCoverUpload = () => {
  openUploadWidget(
    (url: string) => {
      beatCoverUrl.value = url;
    },
    {
      folder: "beatstack-beat-covers",
      cropping: true,
      croppingAspectRatio: 1,
    },
  );
};

const handleWavUpload = () => {
  openUploadWidget(
    (url: string) => {
      wavUrl.value = url;
    },
    {
      uploadPreset: (config.public.cloudinary as any).audioPreset,
      folder: "beatstack-audio-files/wav",
      clientAllowedFormats: ["wav"],
      maxFileSize: 100 * 1024 * 1024, // 100 MB
      cropping: false,
    },
  );
};

const handleMp3Upload = () => {
  openUploadWidget(
    (url: string) => {
      mp3Url.value = url;
    },
    {
      uploadPreset: (config.public.cloudinary as any).audioPreset,
      folder: "beatstack-audio-files/mp3",
      clientAllowedFormats: ["mp3"],
      maxFileSize: 50 * 1024 * 1024, // 50 MB
      cropping: false,
    },
  );
};

function addTag() {
  const val = tagInput.value.trim().toLowerCase();
  if (!val || tags.value.length >= 3 || tags.value.includes(val)) return;
  tags.value.push(val);
  tagInput.value = "";
}

function removeTag(index: number) {
  tags.value.splice(index, 1);
}

async function handleSubmit() {
  loading.value = true;

  try {
    const currentUser = await useCurrentUser();
    const userProfile = useState<any>("userProfile");
    const producerId = userProfile.value?.id;

    if (!producerId) {
      alert("Profile not found. Please create a profile first.");
      return;
    }

    // Validate required fields
    if (
      !title.value ||
      !selectedGenre.value ||
      !bpm.value ||
      !beatCoverUrl.value
    ) {
      alert(
        "Please fill in all required fields: title, genre, BPM, and beat cover.",
      );
      return;
    }

    if (!mp3Url.value && !wavUrl.value) {
      alert("Please upload at least one audio file (WAV or MP3).");
      return;
    }

    if (
      priceBasic.value == null ||
      pricePremium.value == null ||
      priceExclusive.value == null
    ) {
      alert("Please set all pricing tiers.");
      return;
    }

    await $fetch("/api/beats/create", {
      method: "POST",
      body: {
        title: title.value,
        description: description.value || null,
        producerId,
        genre: selectedGenre.value,
        bpm: bpm.value,
        key: selectedKey.value || null,
        tags: tags.value,
        priceBasic: priceBasic.value,
        pricePremium: pricePremium.value,
        priceExclusive: priceExclusive.value,
        coverImage: beatCoverUrl.value,
        audioFile: mp3Url.value || wavUrl.value,
        isPublished: isPublished.value,
      },
    });

    navigateTo("/discover");
  } catch (error: any) {
    console.error("Failed to create beat:", error);
    alert(error.data?.message || "Failed to publish beat. Please try again.");
  } finally {
    loading.value = false;
  }
}
</script>
