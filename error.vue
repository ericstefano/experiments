<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col items-center">
      <p class="text-3xl mb-4 bold">Erro {{ error?.statusCode }}</p>
      <NuxtLink custom to="/">
        <template #default="{ href, navigate }">
          <Button @click="navigate">
            Voltar
          </Button>
        </template>
      </NuxtLink>
    </div>
  </div>
</template>