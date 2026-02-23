<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Profile
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Complete your profile to get started
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="John"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Doe"
            />
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="johndoe"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              v-model="form.role"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a role</option>
              <option value="PRODUCER">Producer</option>
              <option value="LISTENER">Listener</option>
            </select>
          </div>

          <!-- Bio (Optional) -->
          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">Biography (Optional)</label>
            <textarea
              id="bio"
              v-model="form.bio"
              rows="3"
              maxlength="500"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Tell us about yourself..."
            />
            <p class="mt-1 text-xs text-gray-500">{{ form.bio?.length || 0 }}/500 characters</p>
          </div>

          <!-- Profile Picture URL (Optional) -->
          <div>
            <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture URL (Optional)</label>
            <input
              id="profilePicture"
              v-model="form.profilePicture"
              type="url"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating Profile...' : 'Create Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: session } = useAuth();
const loading = ref(false);
const error = ref('');

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  role: '',
  bio: '',
  profilePicture: '',
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    const userId = (session.value?.user as any)?.id;
    
    if (!userId) {
      error.value = 'User session not found. Please log in again.';
      return;
    }

    const response = await $fetch('/api/profile/create', {
      method: 'POST',
      body: {
        userId,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        username: form.value.username,
        role: form.value.role,
        bio: form.value.bio || null,
        profilePicture: form.value.profilePicture || null,
        socialLinks: null,
      },
    });

    // Force a page reload to refresh the session
    window.location.href = '/';
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create profile. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
