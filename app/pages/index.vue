<script setup lang="ts">
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    return navigateTo("/discover");
  }),
});
</script>
