<script setup lang="ts">
definePageMeta({
  middleware: [
    'retrieve-auth',
    'only-users',
  ], // order of middleware affects how it runs
});
const { auth, setAuth } = await useAuth();
async function signout() {
  try {
    await $fetch('/api/signout', {
      method: 'POST',
      async onResponse(ctx) {
        if (!ctx.response.ok) return;
        setAuth({isAuthorized: false, user: null})
        await navigateTo('/signin')
      }
    });
  } catch {}
}
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
            <Button class="mb-1" @click="navigate">Verficar e-mail</Button>
          </template>
        </NuxtLink>
        <Button @click="signout">Signout</Button>
      </div>
    </div>
  </div>
</template>
