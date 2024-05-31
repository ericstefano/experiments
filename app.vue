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