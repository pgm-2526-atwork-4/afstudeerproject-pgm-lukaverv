<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#0d1230] to-[#0a0e27] py-12 px-4"
  >
    <Logo />

    <div
      class="w-full space-y-6 transition-all duration-300"
      :class="currentStep === 3 ? 'max-w-5xl' : 'max-w-md'"
    >
      <!-- Main Card -->
      <div
        class="bg-[#161b33] rounded-2xl border border-gray-800 shadow-2xl p-8"
      >
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-white mb-2">
            Create Your Profile
          </h2>
          <p class="text-gray-400 text-sm">Step {{ currentStep }} of 4</p>
        </div>

        <!-- Progress Bar -->
        <div class="flex gap-2 mb-8">
          <div
            v-for="step in 4"
            :key="step"
            class="h-2 flex-1 rounded-full transition-colors"
            :class="step <= currentStep ? 'bg-blue-600' : 'bg-gray-700'"
          />
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-6"
        >
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">
            Basic Information
          </h3>
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-300 mb-2"
              >First Name</label
            >
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John"
            />
          </div>
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Last Name</label
            >
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Doe"
            />
          </div>
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Username</label
            >
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="johndoe"
            />
          </div>
        </div>

        <!-- Step 2: Role Selection -->
        <div v-if="currentStep === 2" class="space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">
            Choose Your Role
          </h3>
          <div class="space-y-3">
            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="
                form.role === 'PRODUCER'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-gray-700 hover:border-gray-600 bg-[#0d1230]'
              "
            >
              <input
                v-model="form.role"
                type="radio"
                value="PRODUCER"
                class="w-4 h-4 mr-3 text-blue-600 bg-[#0d1230] border-gray-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div>
                <div class="font-medium text-white">Producer</div>
                <div class="text-sm text-gray-400">Create and share music</div>
              </div>
            </label>
            <label
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="
                form.role === 'LISTENER'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-gray-700 hover:border-gray-600 bg-[#0d1230]'
              "
            >
              <input
                v-model="form.role"
                type="radio"
                value="LISTENER"
                class="w-4 h-4 mr-3 text-blue-600 bg-[#0d1230] border-gray-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div>
                <div class="font-medium text-white">Listener</div>
                <div class="text-sm text-gray-400">
                  Discover and enjoy music
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 3: Additional Details -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">
            Additional Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Column: Biography -->
            <div class="flex flex-col">
              <label
                for="bio"
                class="block text-sm font-medium text-gray-300 mb-2"
              >
                Biography (Optional)
              </label>
              <InputCharCount
                :current="form.bio?.length || 0"
                :max="500"
                position="bottom"
              >
                <textarea
                  id="bio"
                  v-model="form.bio"
                  rows="20"
                  maxlength="500"
                  class="w-full px-4 py-3 pb-7 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us about yourself..."
                />
              </InputCharCount>
            </div>

            <!-- Right Column: Profile Picture & Social Links -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture (Optional)
                </label>
                <!-- Profile Picture Preview -->

                <div class="flex flex-col items-center mb-4">
                  <div
                    class="w-32 h-32 rounded-full bg-[#0d1230] border-2 border-gray-700 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="form.profilePicture"
                      :src="form.profilePicture"
                      alt="Profile Preview"
                      class="w-full h-full object-cover"
                      @error="form.profilePicture = ''"
                    />
                    <div v-else class="text-gray-500 text-center px-4">
                      <Icon
                        name="mdi:account-circle"
                        class="w-12 h-12 mx-auto mb-2"
                      />
                      <p class="text-xs">No image</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 text-center">
                    Upload your profile picture below
                  </p>
                </div>
                <button
                  type="button"
                  class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/20"
                  @click="handleUploadClick"
                >
                  {{
                    form.profilePicture ? "Change Picture" : "Upload Picture"
                  }}
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Social Links (Optional)
                </label>
                <div class="space-y-2">
                  <input
                    v-model="form.socialLinks.instagram"
                    type="url"
                    class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Instagram URL"
                  />
                  <input
                    v-model="form.socialLinks.twitter"
                    type="url"
                    class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Twitter URL"
                  />
                  <input
                    v-model="form.socialLinks.soundcloud"
                    type="url"
                    class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="SoundCloud URL"
                  />
                  <input
                    v-model="form.socialLinks.spotify"
                    type="url"
                    class="w-full px-4 py-3 bg-[#0d1230] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Spotify URL"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div v-if="currentStep === 4" class="space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">
            Review Your Profile
          </h3>

          <!-- Profile Picture centered at top -->
          <div class="flex flex-col items-center mb-6">
            <div
              class="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/30 bg-[#0d1230] flex items-center justify-center mb-3"
            >
              <img
                v-if="form.profilePicture"
                :src="form.profilePicture"
                alt="Profile Picture"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else
                name="mdi:account-circle"
                class="w-16 h-16 text-gray-500"
              />
            </div>
            <p class="text-white font-bold text-xl">
              {{ form.firstName }} {{ form.lastName }}
            </p>
            <p class="text-gray-400 text-sm">@{{ form.username }}</p>
            <span
              class="mt-2 px-3 py-1 text-xs font-semibold rounded-full"
              :class="
                form.role === 'PRODUCER'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              "
            >
              {{ form.role }}
            </span>
          </div>

          <!-- Details -->
          <div
            class="bg-[#0d1230] border border-gray-700 rounded-lg p-4 space-y-4"
          >
            <div v-if="form.bio">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Bio
              </p>
              <p class="text-sm text-gray-300">{{ form.bio }}</p>
            </div>

            <div v-if="hasSocialLinks">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Social Links
              </p>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-if="form.socialLinks.instagram"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Icon
                    name="ph:instagram-logo"
                    class="text-pink-400 flex-shrink-0"
                    size="16"
                  />
                  <span class="truncate">Instagram</span>
                </div>
                <div
                  v-if="form.socialLinks.twitter"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Icon
                    name="ph:twitter-logo"
                    class="text-sky-400 flex-shrink-0"
                    size="16"
                  />
                  <span class="truncate">Twitter</span>
                </div>
                <div
                  v-if="form.socialLinks.soundcloud"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Icon
                    name="ph:soundcloud-logo"
                    class="text-orange-400 flex-shrink-0"
                    size="16"
                  />
                  <span class="truncate">SoundCloud</span>
                </div>
                <div
                  v-if="form.socialLinks.spotify"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <Icon
                    name="ph:spotify-logo"
                    class="text-green-400 flex-shrink-0"
                    size="16"
                  />
                  <span class="truncate">Spotify</span>
                </div>
              </div>
            </div>

            <div v-if="!form.bio && !hasSocialLinks" class="text-center py-2">
              <p class="text-sm text-gray-500 italic">
                No additional details added.
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            type="button"
            class="flex-1 px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#0d1230] transition-colors font-medium"
          >
            Back
          </button>
          <button
            v-if="currentStep < 4"
            @click="nextStep"
            type="button"
            :disabled="!canProceed"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-blue-600/20"
          >
            Next
          </button>
          <button
            v-if="currentStep === 4"
            @click="handleSubmit"
            type="button"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-blue-600/20"
          >
            {{ loading ? "Creating..." : "Create Profile" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: "Create Profile" });

useHead({
  script: [
    { src: "https://upload-widget.cloudinary.com/global/all.js", defer: true },
  ],
});

const loading = ref(false);
const error = ref("");
const currentStep = ref(1);

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  role: "",
  bio: "",
  profilePicture: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    soundcloud: "",
    spotify: "",
  },
});

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.value.firstName && form.value.lastName && form.value.username;
  }
  if (currentStep.value === 2) {
    return form.value.role;
  }
  return true;
});

const hasSocialLinks = computed(
  () =>
    form.value.socialLinks.instagram ||
    form.value.socialLinks.twitter ||
    form.value.socialLinks.soundcloud ||
    form.value.socialLinks.spotify,
);

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++;
    error.value = "";
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    error.value = "";
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";
  try {
    const currentUser = await useCurrentUser();
    const userId = currentUser?.id;
    if (!userId) {
      error.value = "User session not found. Please log in again.";
      return;
    }
    await $fetch("/api/profile/create", {
      method: "POST",
      body: {
        userId,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        username: form.value.username,
        role: form.value.role,
        bio: form.value.bio || null,
        profilePicture: form.value.profilePicture || null,
        socialLinks: hasSocialLinks.value ? form.value.socialLinks : null,
      },
    });
    window.location.href = "/discover";
  } catch (err: any) {
    error.value =
      err.data?.message || "Failed to create profile. Please try again.";
  } finally {
    loading.value = false;
  }
};

const { openUploadWidget } = useCloudinaryUpload();

const handleUploadClick = () => {
  openUploadWidget(
    (url: string) => {
      form.value.profilePicture = url;
    },
    {
      folder: "beatstack-profile-pictures",
      cropping: true,
      croppingAspectRatio: 1,
    },
  );
};
</script>
