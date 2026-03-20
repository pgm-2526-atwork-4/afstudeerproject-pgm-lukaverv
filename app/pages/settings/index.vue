<template>
  <div class="min-h-screen pt-16 bg-dark-900">
    <!-- Header -->
    <div
      class="bg-gradient-to-b from-[#1a2040] to-dark-900 py-12 md:py-16 border-b border-gray-700/30"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton class="mb-4" />
        <div>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
          >
            SETTINGS
          </h1>
          <p class="text-lg md:text-xl text-gray-300">
            Manage your account and preferences
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-700/30 sticky top-16 bg-dark-900 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in visibleTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 md:px-6 py-4 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap relative outline-none select-none',
              activeTab === tab.id
                ? 'bg-primary-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800',
            ]"
            :style="activeTab === tab.id ? { color: 'rgb(59, 130, 246)' } : {}"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-slideIn"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="max-w-4xl">
        <div class="space-y-12">
          <!-- Account Actions Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Account Actions</h2>
            <div class="space-y-6">
              <div
                class="flex items-center justify-between py-6 border-b border-gray-700/50"
              >
                <div>
                  <h3 class="text-lg font-semibold text-white mb-1">Logout</h3>
                  <p class="text-sm text-gray-400">
                    Sign out of your account on this device
                  </p>
                </div>
                <button
                  @click="handleLogout"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <!-- Privacy Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Privacy</h2>
            <div
              class="flex items-start justify-between py-6 border-b border-gray-700/50"
            >
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-1">
                  Liked Tracks Visibility
                </h3>
                <p class="text-sm text-gray-400 max-w-lg">
                  Choose whether other users can see which tracks you've liked
                  on your profile.
                </p>
                <div class="flex gap-6 mt-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="likedTracksPublic"
                      type="radio"
                      :value="true"
                      @change="savePrivacySettings"
                      class="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 focus:ring-primary-500"
                    />
                    <span class="text-white font-medium">Public</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="likedTracksPublic"
                      type="radio"
                      :value="false"
                      @change="savePrivacySettings"
                      class="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 focus:ring-primary-500"
                    />
                    <span class="text-white font-medium">Private</span>
                  </label>
                </div>
                <p v-if="privacySaved" class="text-sm text-green-400 mt-3">
                  ✓ Privacy settings saved
                </p>
              </div>
            </div>
          </div>

          <!-- Danger Zone Section -->
          <div>
            <h2 class="text-2xl font-bold text-red-400 mb-8">Danger Zone</h2>
            <div class="space-y-6">
              <!-- Delete Account -->
              <div class="flex items-start justify-between py-6">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white mb-1">
                    Delete Account
                  </h3>
                  <p class="text-sm text-gray-400 max-w-lg">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <p v-if="deleteMessage" class="text-sm text-green-400 mt-2">
                    ✓ {{ deleteMessage }}
                  </p>
                  <p v-if="deleteError" class="text-sm text-red-400 mt-2">
                    {{ deleteError }}
                  </p>
                </div>
                <button
                  @click="requestDelete"
                  :disabled="deleteLoading"
                  class="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-xl transition-all duration-200 border border-red-600/50 whitespace-nowrap ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ deleteLoading ? "Sending..." : "Delete" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Tab -->
      <div v-if="activeTab === 'profile'">
        <VForm @submit="saveProfile" class="space-y-12">
          <!-- Profile Picture Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Profile Picture</h2>
            <div
              class="flex flex-col items-center md:flex-row md:items-start gap-8"
            >
              <div class="flex-shrink-0">
                <div class="relative group">
                  <div
                    class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 ring-4 ring-gray-700/50 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
                  >
                    <img
                      v-if="hasProfilePicture"
                      :src="newProfilePicture || userProfile.profilePicture"
                      alt="Profile Picture"
                      class="w-full h-full object-cover"
                    />
                    <Icon
                      v-else
                      name="mdi:account-circle"
                      class="w-24 md:w-32 h-24 md:h-32 text-gray-300"
                    />
                  </div>
                </div>
              </div>
              <div class="flex-1 space-y-3 text-center md:text-left">
                <p class="text-sm text-gray-400">
                  Recommended: Square image, minimum 400x400px
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    @click="handleUploadClick"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    {{
                      hasProfilePicture ? "Change Picture" : "Upload Picture"
                    }}
                  </button>
                  <button
                    v-if="hasProfilePicture"
                    type="button"
                    @click="removeProfilePicture"
                    class="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-xl transition-all duration-200 border border-red-600/50"
                  >
                    Remove Picture
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Account Information Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">
              Account Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Username (Editable) -->
              <div class="md:col-span-2">
                <TextInput
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  rules="required|min:3|max:30"
                  autocomplete="username"
                  customClass="bg-[#0d1230]"
                  :model-value="userProfile?.username || ''"
                />
              </div>

              <!-- First Name (Read-only) -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2"
                  >First Name</label
                >
                <div
                  class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                >
                  {{ userProfile?.firstName || "N/A" }}
                </div>
              </div>

              <!-- Last Name (Read-only) -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2"
                  >Last Name</label
                >
                <div
                  class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                >
                  {{ userProfile?.lastName || "N/A" }}
                </div>
              </div>

              <!-- Email (Read-only) -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-300 mb-2"
                  >Email Address</label
                >
                <div
                  class="w-full px-4 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400 cursor-not-allowed"
                >
                  {{ userProfile?.user?.email || "N/A" }}
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Biography Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Biography</h2>
            <div>
              <VField
                id="bio"
                name="bio"
                as="textarea"
                rows="6"
                maxlength="500"
                v-model="bio"
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

          <div class="border-t border-gray-700/50"></div>

          <!-- Social Links Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Social Links</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Instagram -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Instagram</label
                >
                <VField
                  name="instagram"
                  type="url"
                  v-model="instagram"
                  class="w-full px-5 py-3.5 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="https://instagram.com/username"
                />
                <VErrorMessage
                  name="instagram"
                  class="text-red-400 text-sm mt-2"
                />
              </div>

              <!-- Twitter -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Twitter</label
                >
                <VField
                  name="twitter"
                  type="url"
                  v-model="twitter"
                  class="w-full px-5 py-3.5 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="https://twitter.com/username"
                />
                <VErrorMessage
                  name="twitter"
                  class="text-red-400 text-sm mt-2"
                />
              </div>

              <!-- SoundCloud -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >SoundCloud</label
                >
                <VField
                  name="soundcloud"
                  type="url"
                  v-model="soundcloud"
                  class="w-full px-5 py-3.5 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="https://soundcloud.com/username"
                />
                <VErrorMessage
                  name="soundcloud"
                  class="text-red-400 text-sm mt-2"
                />
              </div>

              <!-- Spotify -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Spotify</label
                >
                <VField
                  name="spotify"
                  type="url"
                  v-model="spotify"
                  class="w-full px-5 py-3.5 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="https://open.spotify.com/artist/..."
                />
                <VErrorMessage
                  name="spotify"
                  class="text-red-400 text-sm mt-2"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              class="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="profileLoading"
            >
              {{ profileLoading ? "Saving Changes..." : "Save Changes" }}
            </button>
            <button
              type="button"
              @click="cancelProfileEdit"
              class="px-8 py-4 bg-gray-700/50 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-600"
            >
              Cancel
            </button>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="profileError || profileSuccess" class="mb-2">
            <div
              v-if="profileError"
              class="flex items-start justify-between gap-3 text-red-400 bg-red-900/20 border border-red-700/50 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <Icon
                  name="ph:x-circle-fill"
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <p class="font-medium">{{ profileError }}</p>
              </div>
              <button
                @click="profileError = ''"
                class="text-red-400 hover:text-red-300 flex-shrink-0 transition-colors"
              >
                <Icon name="ph:x" class="w-5 h-5" />
              </button>
            </div>
            <div
              v-if="profileSuccess"
              class="flex items-start justify-between gap-3 text-green-400 bg-green-900/20 border border-green-700/50 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <Icon
                  name="ph:check-circle-fill"
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <p class="font-medium">{{ profileSuccess }}</p>
              </div>
              <button
                @click="profileSuccess = ''"
                class="text-green-400 hover:text-green-300 flex-shrink-0 transition-colors"
              >
                <Icon name="ph:x" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </VForm>
      </div>

      <!-- Track Preferences Tab (Producers Only) -->
      <div
        v-if="activeTab === 'preferences' && userProfile?.role === 'PRODUCER'"
      >
        <VForm @submit="savePreferences" class="space-y-12">
          <!-- Description Template Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">
              Default Description Template
            </h2>
            <p class="text-sm text-gray-400 mb-6">
              This description will be pre-filled when creating new beats
            </p>
            <div>
              <textarea
                v-model="preferences.description"
                rows="5"
                maxlength="1000"
                class="w-full px-5 py-4 bg-[#0d1230] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base leading-relaxed"
                placeholder="Example: Hard-hitting beat with dark atmosphere and heavy 808s..."
              />
              <p class="text-sm text-gray-500 mt-2 text-right">
                {{ preferences.description?.length || 0 }}/1000
              </p>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Default Genre Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Default Genre</h2>
            <p class="text-sm text-gray-400 mb-6">
              Select your primary genre - this will be pre-selected when
              creating new beats
            </p>
            <div>
              <VField
                v-model="preferences.genre"
                name="genre"
                as="select"
                class="w-full bg-[#0d1230] border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select a genre</option>
                <option v-for="genre in genres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </VField>
              <VErrorMessage name="genre" class="text-red-400 text-sm mt-2" />
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Default Pricing Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Default Pricing</h2>
            <p class="text-sm text-gray-400 mb-6">
              Set default prices that will be applied to new beats
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Basic License</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium z-10"
                    >€</span
                  >
                  <VField
                    v-model.number="preferences.priceBasic"
                    name="priceBasic"
                    type="number"
                    step="0.01"
                    rules="required|min_value:0"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="29.99"
                  />
                </div>
                <VErrorMessage
                  name="priceBasic"
                  class="text-red-400 text-sm mt-2"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Premium License</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium z-10"
                    >€</span
                  >
                  <VField
                    v-model.number="preferences.pricePremium"
                    name="pricePremium"
                    type="number"
                    step="0.01"
                    rules="required|min_value:0"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="49.99"
                  />
                </div>
                <VErrorMessage
                  name="pricePremium"
                  class="text-red-400 text-sm mt-2"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3"
                  >Exclusive License</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium z-10"
                    >€</span
                  >
                  <VField
                    v-model.number="preferences.priceExclusive"
                    name="priceExclusive"
                    type="number"
                    step="0.01"
                    rules="required|min_value:0"
                    class="w-full bg-[#0d1230] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="199.99"
                  />
                </div>
                <VErrorMessage
                  name="priceExclusive"
                  class="text-red-400 text-sm mt-2"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Default Tags Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Default Tags</h2>
            <p class="text-sm text-gray-400 mb-6">
              Add tags that will be pre-filled when creating new beats (maximum
              3)
            </p>
            <div>
              <!-- Tag chips -->
              <div
                v-if="preferences.tags.length"
                class="flex flex-wrap gap-2 mb-4"
              >
                <span
                  v-for="(tag, i) in preferences.tags"
                  :key="tag"
                  class="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-sm font-medium px-4 py-2 rounded-full"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    @click="removeTag(i)"
                    class="hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </span>
              </div>
              <div class="flex gap-3">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="Add a tag..."
                  :disabled="preferences.tags.length >= 3"
                  class="flex-1 bg-[#0d1230] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  @keydown.enter.prevent="addTag"
                />
                <button
                  type="button"
                  :disabled="preferences.tags.length >= 3 || !tagInput.trim()"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="addTag"
                >
                  Add Tag
                </button>
              </div>
              <p
                v-if="preferences.tags.length >= 3"
                class="text-xs text-gray-500 mt-2"
              >
                Maximum of 3 tags reached
              </p>
            </div>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Default Publish Status Section -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">
              Default Publish Status
            </h2>
            <p class="text-sm text-gray-400 mb-6">
              Choose whether new beats should be published or kept private by
              default
            </p>
            <label class="flex items-center gap-3 cursor-pointer group">
              <input
                v-model="preferences.isPublished"
                type="checkbox"
                class="w-5 h-5 rounded bg-[#0d1230] border-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span
                class="text-white font-medium group-hover:text-gray-200 transition-colors"
              >
                Publish beats automatically
              </span>
            </label>
          </div>

          <div class="border-t border-gray-700/50"></div>

          <!-- Success/Error Messages -->
          <div v-if="preferencesError || preferencesSuccess" class="mb-2">
            <div
              v-if="preferencesError"
              class="flex items-start justify-between gap-3 text-red-400 bg-red-900/20 border border-red-700/50 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <Icon
                  name="ph:x-circle-fill"
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <p class="font-medium">{{ preferencesError }}</p>
              </div>
              <button
                @click="preferencesError = ''"
                class="text-red-400 hover:text-red-300 flex-shrink-0 transition-colors"
              >
                <Icon name="ph:x" class="w-5 h-5" />
              </button>
            </div>
            <div
              v-if="preferencesSuccess"
              class="flex items-start justify-between gap-3 text-green-400 bg-green-900/20 border border-green-700/50 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <Icon
                  name="ph:check-circle-fill"
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <p class="font-medium">{{ preferencesSuccess }}</p>
              </div>
              <button
                @click="preferencesSuccess = ''"
                class="text-green-400 hover:text-green-300 flex-shrink-0 transition-colors"
              >
                <Icon name="ph:x" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              class="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="preferencesLoading"
            >
              {{ preferencesLoading ? "Saving..." : "Save Preferences" }}
            </button>
            <button
              type="button"
              @click="resetPreferences"
              class="px-8 py-4 bg-gray-700/50 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-600"
            >
              Reset to Defaults
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { genres } from "~/data/filterData";

// Require authentication
definePageMeta({
  title: "Settings",
  middleware: "auth",
});

// Load Cloudinary upload widget script
useHead({
  script: [
    { src: "https://upload-widget.cloudinary.com/global/all.js", defer: true },
  ],
});

const { logout } = useLogout();
const userProfile = useState<any>("userProfile");

// Tab management
const activeTab = ref("general");

const allTabs = [
  { id: "general", label: "General", producerOnly: false },
  { id: "profile", label: "Edit Profile", producerOnly: false },
  { id: "preferences", label: "Track Preferences", producerOnly: true },
];

// Only show tabs based on user role
const visibleTabs = computed(() => {
  return allTabs.filter((tab) => {
    if (tab.producerOnly) {
      return userProfile.value?.role === "PRODUCER";
    }
    return true;
  });
});

// ============ GENERAL TAB ============
const handleLogout = logout;

// Privacy settings
const likedTracksPublic = ref<boolean>(
  userProfile.value?.likedTracksPublic !== false,
);
const privacySaved = ref(false);

// Delete account
const deleteLoading = ref(false);
const deleteMessage = ref("");
const deleteError = ref("");

const requestDelete = async () => {
  deleteMessage.value = "";
  deleteError.value = "";
  deleteLoading.value = true;
  try {
    await $fetch("/api/auth/request-delete", { method: "POST" });
    deleteMessage.value = "Check your email for a confirmation link.";
  } catch (err: any) {
    deleteError.value =
      err?.data?.message ?? "Failed to send confirmation email.";
  } finally {
    deleteLoading.value = false;
  }
};

const savePrivacySettings = async () => {
  try {
    await $fetch(`/api/profile/${userProfile.value?.userId}`, {
      method: "PATCH",
      body: { likedTracksPublic: likedTracksPublic.value },
    });
    userProfile.value = {
      ...userProfile.value,
      likedTracksPublic: likedTracksPublic.value,
    };
    privacySaved.value = true;
    setTimeout(() => {
      privacySaved.value = false;
    }, 3000);
  } catch (err) {
    // Failed to save privacy settings
  }
};

// ============ EDIT PROFILE TAB ============
const newProfilePicture = ref<string | null>(null);
const profileLoading = ref(false);
const profileError = ref("");
const profileSuccess = ref("");
const bioLength = ref(0);
const wantsToRemoveProfilePicture = ref(false);

// Computed property to simplify template conditions
const hasProfilePicture = computed(
  () =>
    (newProfilePicture.value || userProfile.value?.profilePicture) &&
    !wantsToRemoveProfilePicture.value,
);

// Form fields refs
const bio = ref("");
const instagram = ref("");
const twitter = ref("");
const soundcloud = ref("");
const spotify = ref("");

const { openUploadWidget } = useCloudinaryUpload();

// Initialize bio length on mount
onMounted(() => {
  bioLength.value = userProfile.value?.bio?.length || 0;
  bio.value = userProfile.value?.bio || "";
  instagram.value = userProfile.value?.socialLinks?.instagram || "";
  twitter.value = userProfile.value?.socialLinks?.twitter || "";
  soundcloud.value = userProfile.value?.socialLinks?.soundcloud || "";
  spotify.value = userProfile.value?.socialLinks?.spotify || "";

  // Load track preferences if producer
  if (userProfile.value?.role === "PRODUCER") {
    loadTrackPreferences();
  }
});

// Update bio length on input
const updateBioLength = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  bioLength.value = target.value.length;
};

// Function to open Cloudinary upload widget
const handleUploadClick = () => {
  openUploadWidget(
    (url: string) => {
      newProfilePicture.value = url;
      wantsToRemoveProfilePicture.value = false;
    },
    {
      folder: "beatstack-profile-pictures",
      cropping: true,
      croppingAspectRatio: 1,
    },
  );
};

// Function to remove profile picture
const removeProfilePicture = () => {
  newProfilePicture.value = null;
  wantsToRemoveProfilePicture.value = true;
};

// Function to save profile changes
const saveProfile = async (values: any) => {
  profileLoading.value = true;
  profileError.value = "";
  profileSuccess.value = "";

  try {
    const updateData: any = {
      username: values.username,
      bio: bio.value || "",
      socialLinks: {
        instagram: instagram.value || "",
        twitter: twitter.value || "",
        soundcloud: soundcloud.value || "",
        spotify: spotify.value || "",
      },
    };

    if (wantsToRemoveProfilePicture.value) {
      updateData.profilePicture = null;
    } else if (newProfilePicture.value) {
      updateData.profilePicture = newProfilePicture.value;
    }

    const updatedProfile = (await $fetch(
      `/api/profile/${userProfile.value?.userId}`,
      {
        method: "PATCH",
        body: updateData,
      },
    )) as any;

    userProfile.value = updatedProfile;
    useState("username").value = updatedProfile.username;
    bio.value = updatedProfile.bio || "";
    instagram.value = updatedProfile.socialLinks?.instagram || "";
    twitter.value = updatedProfile.socialLinks?.twitter || "";
    soundcloud.value = updatedProfile.socialLinks?.soundcloud || "";
    spotify.value = updatedProfile.socialLinks?.spotify || "";
    bioLength.value = updatedProfile.bio?.length || 0;
    newProfilePicture.value = null;
    wantsToRemoveProfilePicture.value = false;
    profileSuccess.value = "Profile updated successfully!";
  } catch (err: any) {
    profileError.value = err.data?.message || "Failed to update profile";
  } finally {
    profileLoading.value = false;
  }
};

const cancelProfileEdit = () => {
  newProfilePicture.value = null;
  wantsToRemoveProfilePicture.value = false;
  bio.value = userProfile.value?.bio || "";
  instagram.value = userProfile.value?.socialLinks?.instagram || "";
  twitter.value = userProfile.value?.socialLinks?.twitter || "";
  soundcloud.value = userProfile.value?.socialLinks?.soundcloud || "";
  spotify.value = userProfile.value?.socialLinks?.spotify || "";
  profileError.value = "";
  profileSuccess.value = "";
};

// ============ TRACK PREFERENCES TAB ============
const preferences = ref({
  description: "",
  genre: "",
  priceBasic: 29.99,
  pricePremium: 49.99,
  priceExclusive: 199.99,
  isPublished: true,
  tags: [] as string[],
});

const tagInput = ref("");

// Tag management using useBeatForm composable
const preferenceTags = computed({
  get: () => preferences.value.tags,
  set: (val) => {
    preferences.value.tags = val;
  },
});

const { addTag, removeTag } = useBeatForm(
  ref(""), // beatCoverUrl - not needed
  ref(""), // wavUrl - not needed
  ref(""), // mp3Url - not needed
  preferenceTags,
  tagInput,
);

const preferencesLoading = ref(false);
const preferencesError = ref("");
const preferencesSuccess = ref("");

// Load track preferences
const loadTrackPreferences = async () => {
  try {
    const data = await $fetch("/api/track-preferences");
    if (data) {
      preferences.value = {
        genre: data.genre || "",
        description: data.description || "",
        priceBasic: data.priceBasic || 29.99,
        pricePremium: data.pricePremium || 49.99,
        priceExclusive: data.priceExclusive || 199.99,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        tags: data.tags || [],
      };
    }
  } catch (error) {
    // Failed to load preferences, use defaults
  }
};

// Save track preferences
const savePreferences = async () => {
  preferencesLoading.value = true;
  preferencesError.value = "";
  preferencesSuccess.value = "";

  try {
    await $fetch("/api/track-preferences", {
      method: "PATCH",
      body: preferences.value,
    });
    preferencesSuccess.value = "Track preferences saved successfully!";
  } catch (err: any) {
    preferencesError.value =
      err.data?.message || "Failed to save track preferences";
  } finally {
    preferencesLoading.value = false;
  }
};

// Reset preferences to defaults
const resetPreferences = () => {
  preferences.value = {
    description: "",
    genre: "",
    priceBasic: 29.99,
    pricePremium: 49.99,
    priceExclusive: 199.99,
    isPublished: true,
    tags: [],
  };
  tagInput.value = "";
};
</script>
