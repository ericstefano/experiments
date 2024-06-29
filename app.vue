<script setup lang="ts">
import { APP_NAME } from '~/constants'

useHead({
  title: APP_NAME,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.18s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>