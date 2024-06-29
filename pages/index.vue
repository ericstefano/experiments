<script setup lang="ts">
definePageMeta({
  middleware: [
    'only-users',
  ],
});
const { auth } = await useAuth();
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-background px-8">
    <div class="px-4 py-8 border border-1 border-foreground rounded">
      <p class="text-2xl mb-4 text-center font-bold">Área logada</p>
      <p class="max-w-sm text-center font-mono mb-4">
        {{ auth?.user }}
      </p>
      <div class="flex flex-col items-center justify-center gap-3">
        <p :class="{ 'text-green-500': auth?.user?.emailVerified, 'text-red-500': !auth?.user?.emailVerified }"
          v-if="!auth?.user?.emailVerified">Seu e-mail {{ auth?.user?.emailVerified ? 'está' : 'não está' }} verfificado.</p>
        <NuxtLink v-if="!auth?.user?.emailVerified" custom to="/verify">
          <template #default="{ href, navigate }">
            <Button @click="navigate">Verficar e-mail</Button>
          </template>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
