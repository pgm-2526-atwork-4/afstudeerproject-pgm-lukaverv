<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-white mb-6">Edit Profile</h1>

    <VForm @submit="saveChanges" class="bg-gray-800 p-6 rounded-lg max-w-2xl">
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
            type="button"
            @click="handleUploadClick"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Change Picture
          </button>
        </div>
      </div>

      <!-- Username -->
      <div class="mb-6">
        <TextInput
          name="username"
          label="Username"
          placeholder="Enter your username"
          rules="required|min:3|max:30"
          autocomplete="username"
          customClass="bg-gray-700"
          :model-value="userProfile?.username || ''"
        />
      </div>

      <!-- Save Button -->
      <div class="flex gap-4">
        <button
          type="submit"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
          :disabled="loading"
        >
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
        <button
          type="button"
          @click="cancelEdit"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>

      <!-- Success/Error Messages -->
      <p v-if="error" class="text-red-400 text-sm mt-4">{{ error }}</p>
      <p v-if="success" class="text-green-400 text-sm mt-4">{{ success }}</p>
    </VForm>
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

const { openUploadWidget } = useCloudinaryUpload();

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

    if (newProfilePicture.value) {
      updateData.profilePicture = newProfilePicture.value;
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
    setTimeout(() => navigateTo("/discover"), 1500);
  } catch (err: any) {
    error.value = err.data?.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};

// Function to cancel edit and navigate back
const cancelEdit = () => navigateTo("/discover");
</script>
