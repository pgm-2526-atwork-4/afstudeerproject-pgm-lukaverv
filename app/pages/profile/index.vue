<script setup lang="ts">
definePageMeta({
  title: "My Profile",
  middleware: "require-verification",
});

const user = await useCurrentUser();

if (user) {
  await navigateTo(`/profile/${user.id}`, { replace: true });
} else {
  await navigateTo("/auth/login", { replace: true });
}
</script>

<template>
  <LoadingSpinner message="Redirecting to your profile..." />
</template>
