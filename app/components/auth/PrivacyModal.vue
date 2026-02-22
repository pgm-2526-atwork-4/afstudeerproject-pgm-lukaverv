<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="close"
  >
    <div
      class="bg-[#161b33] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
    >
      <div class="p-6 border-b border-gray-700">
        <h2 class="text-2xl font-bold text-white">Privacy Policy</h2>
      </div>

      <div class="overflow-y-auto p-6 text-gray-300 space-y-4">
        <p class="text-sm text-gray-400">Last updated: February 22, 2026</p>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            1. Information We Collect
          </h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul class="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>Email address and password</li>
            <li>Profile information (name, bio, profile picture)</li>
            <li>Content you upload (beats, tracks, playlists)</li>
            <li>Usage data and preferences</li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            2. How We Use Your Information
          </h3>
          <p>We use the information we collect to:</p>
          <ul class="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Personalize your experience</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            3. Information Sharing
          </h3>
          <p>
            We do not sell your personal information. We may share your
            information only in the following circumstances:
          </p>
          <ul class="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>
              With service providers who assist us in operating our platform
            </li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            4. Data Security
          </h3>
          <p>
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            5. Cookies and Tracking
          </h3>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our service and store certain information to improve your
            experience.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul class="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to our use of your data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            7. Children's Privacy
          </h3>
          <p>
            Our service is not intended for children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            8. Changes to Privacy Policy
          </h3>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">9. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us.
          </p>
        </section>
      </div>

      <div class="p-6 border-t border-gray-700">
        <button
          @click="close"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const { close } = useModalClose(emit);
</script>
