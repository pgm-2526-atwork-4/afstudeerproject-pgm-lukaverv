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
        <h2 class="text-2xl font-bold text-white">Terms of Service</h2>
      </div>

      <div class="overflow-y-auto p-6 text-gray-300 space-y-4">
        <p class="text-sm text-gray-400">Last updated: February 22, 2026</p>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            1. Acceptance of Terms
          </h3>
          <p>
            By accessing and using BeatStack, you accept and agree to be bound
            by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">2. Use License</h3>
          <p>
            Permission is granted to temporarily use BeatStack for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">3. User Account</h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">4. User Content</h3>
          <p>
            You retain all rights to the content you upload. By uploading
            content, you grant BeatStack a worldwide, non-exclusive license to
            use, store, and display your content.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            5. Prohibited Activities
          </h3>
          <p>You may not:</p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>Use the service for any illegal purpose</li>
            <li>
              Attempt to gain unauthorized access to any part of the service
            </li>
            <li>Upload malicious code or viruses</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Violate any intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">6. Termination</h3>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice, for conduct that we believe violates these Terms of Service.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            7. Limitation of Liability
          </h3>
          <p>
            BeatStack shall not be liable for any indirect, incidental, special,
            consequential or punitive damages resulting from your use of or
            inability to use the service.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-white mb-2">
            8. Changes to Terms
          </h3>
          <p>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes via email or through the
            service.
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
