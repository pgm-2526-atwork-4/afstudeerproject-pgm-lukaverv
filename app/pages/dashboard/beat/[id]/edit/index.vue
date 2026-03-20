<template>
  <DeleteConfirmModal
    v-model="showDeleteModal"
    item-name="beat"
    @confirm="confirmDelete"
  />

  <div
    class="min-h-screen pt-16 bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 md:py-8">
      <!-- Header -->
      <div class="mb-6 md:mb-8">
        <BackButton />
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
              Edit Beat
            </h1>
            <p class="text-sm md:text-base text-gray-400">
              Update your beat details and files
            </p>
          </div>
          <button
            @click="showDeleteModal = true"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Icon name="ph:trash" class="w-4 h-4" />
            Delete Beat
          </button>
        </div>
      </div>

      <VForm @submit="handleSubmit">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <!-- Left: scrollable -->
          <div class="w-full lg:flex-1 lg:min-w-0 space-y-4 md:space-y-6">
            <!-- Basic Info -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-4 md:p-6 shadow-xl"
            >
              <h2
                class="text-base md:text-lg font-bold text-white mb-4 md:mb-5"
              >
                Basic Info
              </h2>
              <div class="flex flex-col sm:flex-row gap-5 items-stretch">
                <!-- Beat Cover -->
                <div class="flex-shrink-0 flex flex-col">
                  <p class="text-xs font-medium text-gray-400 mb-2">
                    Beat cover <span class="text-red-400">*</span>
                  </p>
                  <div
                    class="flex-1 w-full sm:w-48 aspect-square sm:aspect-auto rounded-xl border-2 border-dashed bg-[#0d1230] flex flex-col items-center justify-center gap-2 text-gray-500 cursor-pointer hover:border-blue-500 transition-colors sm:min-h-[8rem] overflow-hidden"
                    :class="
                      submitAttempted && !beatCoverUrl
                        ? 'border-red-500'
                        : 'border-gray-600'
                    "
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
                  <p
                    v-if="submitAttempted && !beatCoverUrl"
                    class="text-red-400 text-xs mt-1"
                  >
                    Beat cover is required
                  </p>
                </div>

                <!-- Title + Description -->
                <div class="flex-1 flex flex-col gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">
                      Title <span class="text-red-400">*</span>
                    </label>
                    <InputCharCount :current="title.length" :max="80">
                      <VField
                        v-model="title"
                        name="title"
                        type="text"
                        placeholder="Beat title"
                        maxlength="80"
                        rules="required|min:3|max:80"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </InputCharCount>
                    <VErrorMessage
                      name="title"
                      class="text-red-400 text-xs mt-1"
                    />
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
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-4 md:p-6 shadow-xl"
            >
              <h2
                class="text-base md:text-lg font-bold text-white mb-4 md:mb-5"
              >
                Metadata
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">
                    Key <span class="text-red-400">*</span>
                  </label>
                  <VField
                    v-model="selectedKey"
                    name="key"
                    as="select"
                    rules="required"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select key</option>
                    <option v-for="key in musicalKeys" :key="key" :value="key">
                      {{ key }}
                    </option>
                  </VField>
                  <VErrorMessage name="key" class="text-red-400 text-xs mt-1" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">
                    BPM <span class="text-red-400">*</span>
                  </label>
                  <VField
                    v-model="bpm"
                    name="bpm"
                    type="number"
                    placeholder="140"
                    rules="required|min_value:40|max_value:250"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <VErrorMessage name="bpm" class="text-red-400 text-xs mt-1" />
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-xs font-medium text-gray-400 mb-1">
                  Genre <span class="text-red-400">*</span>
                </label>
                <VField
                  v-model="selectedGenre"
                  name="genre"
                  as="select"
                  rules="required"
                  class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select genre</option>
                  <option v-for="genre in genres" :key="genre" :value="genre">
                    {{ genre }}
                  </option>
                </VField>
                <VErrorMessage name="genre" class="text-red-400 text-xs mt-1" />
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
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-4 md:p-6 shadow-xl"
            >
              <h2
                class="text-base md:text-lg font-bold text-white mb-4 md:mb-5"
              >
                Pricing
              </h2>
              <div class="space-y-3">
                <div
                  class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <div class="sm:w-28 text-sm text-gray-300 pt-2.5">
                    Basic <span class="text-red-400">*</span>
                  </div>
                  <div class="flex-1">
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >€</span
                      >
                      <VField
                        v-model="priceBasic"
                        name="priceBasic"
                        type="number"
                        placeholder="29.99"
                        step="0.01"
                        rules="price"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <VErrorMessage
                      name="priceBasic"
                      class="text-red-400 text-xs mt-1"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <div class="sm:w-28 text-sm text-gray-300 pt-2.5">
                    Premium <span class="text-red-400">*</span>
                  </div>
                  <div class="flex-1">
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >€</span
                      >
                      <VField
                        v-model="pricePremium"
                        name="pricePremium"
                        type="number"
                        placeholder="59.99"
                        step="0.01"
                        rules="price"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <VErrorMessage
                      name="pricePremium"
                      class="text-red-400 text-xs mt-1"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <div class="sm:w-28 text-sm text-gray-300 pt-2.5">
                    Exclusive <span class="text-red-400">*</span>
                  </div>
                  <div class="flex-1">
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >€</span
                      >
                      <VField
                        v-model="priceExclusive"
                        name="priceExclusive"
                        type="number"
                        placeholder="299.99"
                        step="0.01"
                        rules="price"
                        class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <VErrorMessage
                      name="priceExclusive"
                      class="text-red-400 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: sticky sidebar -->
          <div
            class="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-20 self-start space-y-4"
          >
            <!-- Audio Files -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-4 md:p-5 shadow-xl"
            >
              <h2 class="text-sm md:text-base font-bold text-white mb-4">
                Audio Files
              </h2>

              <!-- WAV Untagged -->
              <div class="mb-3">
                <p class="text-xs font-medium text-gray-400 mb-1.5">
                  WAV <span class="text-gray-500">(untagged)</span>
                  <span class="text-red-400">*</span>
                </p>
                <div
                  class="flex items-center gap-3 bg-[#0d1230] border rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500 transition-colors"
                  :class="
                    wavUrl
                      ? 'border-green-600'
                      : submitAttempted && !wavUrl
                        ? 'border-red-500'
                        : 'border-gray-700'
                  "
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
                <p
                  v-if="submitAttempted && !wavUrl"
                  class="text-red-400 text-xs mt-1"
                >
                  WAV file is required
                </p>
                <p v-else class="text-xs text-gray-600 mt-1">
                  WAV only, max 100 MB
                </p>
              </div>

              <!-- MP3 Tagged -->
              <div>
                <p class="text-xs font-medium text-gray-400 mb-1.5">
                  MP3 <span class="text-gray-500">(tagged)</span>
                  <span class="text-red-400">*</span>
                </p>
                <div
                  class="flex items-center gap-3 bg-[#0d1230] border rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500 transition-colors"
                  :class="
                    mp3Url
                      ? 'border-green-600'
                      : submitAttempted && !mp3Url
                        ? 'border-red-500'
                        : 'border-gray-700'
                  "
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
                <p
                  v-if="submitAttempted && !mp3Url"
                  class="text-red-400 text-xs mt-1"
                >
                  MP3 file is required
                </p>
                <p v-else class="text-xs text-gray-600 mt-1">
                  MP3 only, max 50 MB
                </p>
              </div>
            </div>

            <!-- Visibility -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-4 md:p-5 shadow-xl"
            >
              <h2 class="text-sm md:text-base font-bold text-white mb-3">
                Visibility
              </h2>
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

            <!-- Server error -->
            <p v-if="serverError" class="text-red-400 text-sm text-center">
              {{ serverError }}
            </p>

            <!-- Save Changes -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {{ loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </VForm>
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
  title: "Edit Beat",
  middleware: "producer-only",
});

const route = useRoute();
const router = useRouter();

const beatId = route.params.id;

// Fetch real beat data
const { data: beatData, error } = await useFetch(`/api/beats/${beatId}`, {
  headers: useRequestHeaders(["cookie"]),
});

if (error.value || !beatData.value) {
  navigateTo("/dashboard");
}

const beat = beatData.value as any;

// Set dynamic title based on beat data
usePageTitle(
  () => (beat?.title ? `Edit ${beat.title}` : undefined),
  "Edit Beat",
);

// Pre-fill form with real beat data
const beatCoverUrl = ref(beat?.coverImage || "");
const wavUrl = ref(beat?.audioUrlWav || "");
const mp3Url = ref(beat?.audioUrl || "");
const title = ref(beat?.title || "");
const description = ref(beat?.description || "");
const selectedKey = ref(beat?.key || "");
const bpm = ref<number | null>(beat?.bpm || null);
const selectedGenre = ref(beat?.genre || "");
const tags = ref<string[]>(beat?.tags || []);
const tagInput = ref("");
const priceBasic = ref<number | null>(beat?.priceBasic || null);
const pricePremium = ref<number | null>(beat?.pricePremium || null);
const priceExclusive = ref<number | null>(beat?.priceExclusive || null);
const isPublished = ref(beat?.isPublished ?? true);
const loading = ref(false);
const serverError = ref("");
const submitAttempted = ref(false);
const showDeleteModal = ref(false);
const audioDuration = ref(0);

const {
  handleBeatCoverUpload,
  handleWavUpload,
  handleMp3Upload,
  addTag,
  removeTag,
} = useBeatForm(beatCoverUrl, wavUrl, mp3Url, tags, tagInput, audioDuration);

const handleSubmit = async () => {
  submitAttempted.value = true;
  serverError.value = "";

  // Validate file uploads (outside VForm scope)
  if (!beatCoverUrl.value || !wavUrl.value || !mp3Url.value) return;

  loading.value = true;

  try {
    await $fetch(`/api/beats/${beatId}`, {
      method: "PUT",
      headers: useRequestHeaders(["cookie"]),
      body: {
        title: title.value,
        description: description.value,
        key: selectedKey.value,
        bpm: bpm.value,
        genre: selectedGenre.value,
        tags: tags.value,
        priceBasic: priceBasic.value,
        pricePremium: pricePremium.value,
        priceExclusive: priceExclusive.value,
        isPublished: isPublished.value,
        coverImage: beatCoverUrl.value,
        audioFileMp3: mp3Url.value,
        audioFileWav: wavUrl.value,
        duration: audioDuration.value || null,
      },
    });

    router.push(`/dashboard/beat/${beatId}`);
  } catch (err: any) {
    serverError.value =
      err?.data?.message || "Failed to save changes. Please try again.";
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async () => {
  loading.value = true;

  try {
    await $fetch(`/api/beats/${beatId}`, {
      method: "DELETE",
      headers: useRequestHeaders(["cookie"]),
    });

    showDeleteModal.value = false;
    router.push("/dashboard?tab=tracks");
  } catch (err: any) {
    alert(err?.data?.message || "Failed to delete beat. Please try again.");
  } finally {
    loading.value = false;
    showDeleteModal.value = false;
  }
};
</script>
