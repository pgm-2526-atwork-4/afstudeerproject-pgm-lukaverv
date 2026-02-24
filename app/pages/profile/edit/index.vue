<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-white mb-6">Edit Profile</h1>

    <div class="bg-gray-800 p-6 rounded-lg max-w-2xl">
      <!-- Profile Picture -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Profile Picture</label
        >
        <div class="flex items-center gap-4">
          <img
            v-if="newProfilePicture || userProfile?.profilePicture"
            :src="newProfilePicture || userProfile.profilePicture"
            alt="Profile Picture"
            class="w-20 h-20 rounded-full object-cover"
          />
          <div
            v-else
            class="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center"
          >
            <Icon name="mdi:account-circle" class="w-10 h-10 text-gray-400" />
          </div>
          <button
            @click="handleUploadClick"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Change Picture
          </button>
        </div>
      </div>

      <!-- Username -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Username</label
        >
        <input
          v-model="username"
          type="text"
          class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border border-red-500': usernameError }"
        />
        <p v-if="usernameError" class="text-red-500 text-sm mt-1">
          {{ usernameError }}
        </p>
      </div>

      <!-- Email -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Email</label
        >
        <input
          :value="userProfile?.email"
          type="email"
          disabled
          class="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
        />
      </div>

      <!-- Save Button -->
      <div class="flex gap-4">
        <button
          @click="saveChanges"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
        >
          Save Changes
        </button>
        <button
          @click="cancelEdit"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
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

const userProfile = useState<any>("userProfile");
const username = ref(userProfile.value?.username || "");
const newProfilePicture = ref<string | null>(null);
const usernameError = ref("");

const { openUploadWidget } = useCloudinaryUpload();

const handleUploadClick = () => {
  openUploadWidget((url: string) => {
    newProfilePicture.value = url;
  });
};

const saveChanges = () => {
  // TODO: Implement save logic
};

const cancelEdit = () => {
  // Reset to original values
  username.value = userProfile.value?.username || "";
  newProfilePicture.value = null;
  // Navigate back or to profile page
  navigateTo("/discover");
};
</script>
