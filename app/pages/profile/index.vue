<script setup>
definePageMeta({
  middleware: "require-verification",
});

const router = useRouter();

// Fetch current user
const { data: currentUser } = await useFetch("/api/auth/user", {
  credentials: "include",
});

// redirect to own profile if visiting /profile
watch(
  () => currentUser.value,
  (user) => {
    if (user && router.currentRoute.value.path === "/profile") {
      navigateTo(`/profile/${user.id}`);
    }
  },
  { immediate: true },
);
</script>

<template>
  <LoadingSpinner message="Redirecting to your profile..." />
</template>
