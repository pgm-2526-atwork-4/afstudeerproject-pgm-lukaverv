<template>
  <div class="container mx-auto py-8 px-4 lg:px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <button
          @click="goBack"
          class="flex items-center text-gray-400 hover:text-gray-300 transition mb-4"
        >
          <span class="mr-2">←</span> Back
        </button>
        <h1 class="text-4xl font-bold text-white mb-3">Edit Profile</h1>
        <p class="text-gray-400 text-lg">Update your profile information</p>
      </div>

      <!-- Main Container -->
      <div>
        <VForm
          @submit="saveChanges"
          class="grid grid-cols-1 xl:grid-cols-5 gap-8 p-1"
        >
          <!-- Left Container: Profile Picture & Account Info -->
          <div class="xl:col-span-2 space-y-6">
            <!-- Profile Picture -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-8 shadow-xl"
            >
              <h2
                class="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              >
                <Icon name="mdi:camera" class="w-6 h-6 text-blue-400" />
                Profile Picture
              </h2>
              <div class="flex flex-col items-center text-center">
                <div class="relative group">
                  <img
                    v-if="newProfilePicture || userProfile?.profilePicture"
                    :src="newProfilePicture || userProfile.profilePicture"
                    alt="Profile Picture"
                    class="w-40 h-40 rounded-full object-cover ring-4 ring-gray-700/50 shadow-2xl transition-transform group-hover:scale-105"
                  />
                  <div
                    v-else
                    class="w-40 h-40 rounded-full bg-[#0d1230] border-2 border-gray-700 flex items-center justify-center shadow-2xl"
                  >
                    <Icon
                      name="mdi:account-circle"
                      class="w-20 h-20 text-gray-500"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-4 mb-5">
                  Recommended: Square image, min 400x400px
                </p>
                <button
                  type="button"
                  @click="handleUploadClick"
                  class="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
                >
                  <Icon name="mdi:upload" class="w-5 h-5 inline mr-2 -mt-0.5" />
                  {{
                    newProfilePicture || userProfile?.profilePicture
                      ? "Change Picture"
                      : "Upload Picture"
                  }}
                </button>
              </div>
            </div>

            <!-- Account Information -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-8 shadow-xl"
            >
              <h2
                class="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              >
                <Icon name="mdi:account" class="w-6 h-6 text-blue-400" />
                Account Information
              </h2>
              <div class="space-y-5">
                <!-- Username (Editable) -->
                <TextInput
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  rules="required|min:3|max:30"
                  autocomplete="username"
                  customClass="bg-[#0d1230]"
                  :model-value="userProfile?.username || ''"
                />

                <!-- First Name (Read-only) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    First Name
                  </label>
                  <div
                    class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                  >
                    {{ userProfile?.firstName || "N/A" }}
                  </div>
                </div>

                <!-- Last Name (Read-only) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div
                    class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                  >
                    {{ userProfile?.lastName || "N/A" }}
                  </div>
                </div>

                <!-- Email (Read-only) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div
                    class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                  >
                    {{ userProfile?.user?.email || "N/A" }}
                  </div>
                  <p
                    class="text-xs text-gray-500 mt-2 flex items-center gap-1.5"
                  >
                    <Icon name="mdi:lock" class="w-3.5 h-3.5" />
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Container: Bio & Social Links -->
          <div class="xl:col-span-3 flex flex-col gap-6">
            <!-- Biography -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-8 shadow-xl"
            >
              <h2
                class="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              >
                <Icon name="mdi:text-box" class="w-6 h-6 text-purple-400" />
                Biography
              </h2>
              <div>
                <VField
                  id="bio"
                  name="bio"
                  as="textarea"
                  rows="5"
                  maxlength="500"
                  :value="userProfile?.bio || ''"
                  @input="updateBioLength"
                  class="w-full px-5 py-4 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base leading-relaxed"
                  placeholder="Tell us about yourself, your music journey, influences..."
                />
                <div class="flex justify-between items-center mt-3">
                  <VErrorMessage
                    name="bio"
                    class="text-red-400 text-sm font-medium"
                  />
                  <p class="text-sm text-gray-500 font-medium">
                    {{ bioLength }}/500
                  </p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-8 shadow-xl flex flex-col flex-1"
            >
              <h2
                class="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              >
                <Icon name="mdi:share-variant" class="w-6 h-6 text-green-400" />
                Social Links
              </h2>
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 content-start"
              >
                <!-- Instagram -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                  >
                    <Icon name="mdi:instagram" class="w-5 h-5 text-pink-500" />
                    Instagram
                  </label>
                  <VField
                    name="instagram"
                    type="url"
                    :value="userProfile?.socialLinks?.instagram || ''"
                    class="w-full px-5 py-8 bg-[#0d1230] border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="instagram.com/username"
                  />
                  <VErrorMessage
                    name="instagram"
                    class="text-red-400 text-sm mt-2"
                  />
                </div>

                <!-- Twitter -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                  >
                    <Icon name="mdi:twitter" class="w-5 h-5 text-blue-400" />
                    Twitter
                  </label>
                  <VField
                    name="twitter"
                    type="url"
                    :value="userProfile?.socialLinks?.twitter || ''"
                    class="w-full px-5 py-8 bg-[#0d1230] border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="twitter.com/username"
                  />
                  <VErrorMessage
                    name="twitter"
                    class="text-red-400 text-sm mt-2"
                  />
                </div>

                <!-- SoundCloud -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                  >
                    <Icon
                      name="mdi:soundcloud"
                      class="w-5 h-5 text-orange-500"
                    />
                    SoundCloud
                  </label>
                  <VField
                    name="soundcloud"
                    type="url"
                    :value="userProfile?.socialLinks?.soundcloud || ''"
                    class="w-full px-5 py-8 bg-[#0d1230] border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="soundcloud.com/username"
                  />
                  <VErrorMessage
                    name="soundcloud"
                    class="text-red-400 text-sm mt-2"
                  />
                </div>

                <!-- Spotify -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                  >
                    <Icon name="mdi:spotify" class="w-5 h-5 text-green-500" />
                    Spotify
                  </label>
                  <VField
                    name="spotify"
                    type="url"
                    :value="userProfile?.socialLinks?.spotify || ''"
                    class="w-full px-5 py-8 bg-[#0d1230] border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="open.spotify.com/artist/..."
                  />
                  <VErrorMessage
                    name="spotify"
                    class="text-red-400 text-sm mt-2"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="bg-[#161b33] border border-gray-700/50 rounded-2xl p-8 shadow-xl"
            >
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  class="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="loading"
                >
                  <Icon
                    v-if="loading"
                    name="mdi:loading"
                    class="w-5 h-5 inline mr-2 -mt-0.5 animate-spin"
                  />
                  <Icon
                    v-else
                    name="mdi:content-save"
                    class="w-5 h-5 inline mr-2 -mt-0.5"
                  />
                  {{ loading ? "Saving Changes..." : "Save Changes" }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="flex-1 px-8 py-4 bg-gray-700/50 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="error || success" class="xl:col-span-5 px-1">
            <div
              v-if="error"
              class="flex items-center gap-3 text-red-400 bg-red-900/30 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <Icon name="mdi:alert-circle" class="w-5 h-5 flex-shrink-0" />
              <p class="font-medium">{{ error }}</p>
            </div>
            <div
              v-if="success"
              class="flex items-center gap-3 text-green-400 bg-green-900/30 border border-green-700/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <Icon name="mdi:check-circle" class="w-5 h-5 flex-shrink-0" />
              <p class="font-medium">{{ success }}</p>
            </div>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Load Cloudinary upload widget script
useHead({
  script: [
    {
      src: "https://upload-widget.cloudinary.com/global/all.js",
      defer: true,
    },
  ],
});

// Reactive variables for state management
const userProfile = useState<any>("userProfile");
const newProfilePicture = ref<string | null>(null);
const loading = ref(false);
const error = ref("");
const success = ref("");
const bioLength = ref(0);

const { openUploadWidget } = useCloudinaryUpload();
const { goBack } = useNavigation();

// Initialize bio length on mount
onMounted(() => {
  bioLength.value = userProfile.value?.bio?.length || 0;
});

// Update bio length on input
const updateBioLength = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  bioLength.value = target.value.length;
};

// Function to open Cloudinary upload widget
const handleUploadClick = () => {
  openUploadWidget((url: string) => {
    newProfilePicture.value = url;
  });
};

// Function to save profile changes
const saveChanges = async (values: any) => {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    // Prepare data for update
    const updateData: any = {};

    if (values.username !== userProfile.value?.username) {
      updateData.username = values.username;
    }

    if (values.bio !== userProfile.value?.bio) {
      updateData.bio = values.bio || "";
    }

    if (newProfilePicture.value) {
      updateData.profilePicture = newProfilePicture.value;
    }

    // Handle social links
    const socialLinks = {
      instagram: values.instagram || "",
      twitter: values.twitter || "",
      soundcloud: values.soundcloud || "",
      spotify: values.spotify || "",
    };

    const currentSocials = userProfile.value?.socialLinks || {};
    const socialsChanged =
      socialLinks.instagram !== (currentSocials.instagram || "") ||
      socialLinks.twitter !== (currentSocials.twitter || "") ||
      socialLinks.soundcloud !== (currentSocials.soundcloud || "") ||
      socialLinks.spotify !== (currentSocials.spotify || "");

    if (socialsChanged) {
      updateData.socialLinks = socialLinks;
    }

    // Update profile via API
    const updatedProfile = (await $fetch(
      `/api/profile/${userProfile.value?.userId}`,
      {
        method: "PATCH",
        body: updateData,
      },
    )) as any;

    // Update global state
    userProfile.value = updatedProfile;
    useState("username").value = updatedProfile.username;
    newProfilePicture.value = null;
    success.value = "Profile updated successfully!";

    // Redirect to discover page after success
    navigateTo("/discover");
  } catch (err: any) {
    error.value = err.data?.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};

// Function to cancel edit and navigate back
const cancelEdit = () => navigateTo("/discover");
</script>
