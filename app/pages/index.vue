<script setup>
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    return navigateTo("/discover");
  }),
});
</script>
