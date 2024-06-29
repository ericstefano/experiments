<script setup lang="ts">
const mode = useColorMode();
</script>

<template>
  <NuxtLoadingIndicator :color="mode.value === 'dark' ? '#fff' : '#000'" />
  <div>
    <slot />
  </div>
</template>
