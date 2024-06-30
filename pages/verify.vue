<script lang="ts" setup>
definePageMeta({
  middleware: [
    'retrieve-auth',
    'only-users',
    async function () {
      const { auth } = await useAuth();
     if (auth?.value?.user?.emailVerified) return navigateTo('/')
    }
  ],
});

useFetch('/api/send-verify', {
  lazy: true,
  method: 'POST',
})

const { setAuth } = await useAuth();
async function sendVerification() {
  const data = await $fetch('/api/verify-email', {
    body: {
      code: code.value
    },
    method: 'POST',
  })
  setAuth({isAuthorized: true, user: data})
  await navigateTo('/')
}

const code = ref('');
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="p-6 border border-1 border-foreground rounded-lg">
      <p class="mb-2 text-xl font-bold">Verificar e-mail</p>
        <div class="flex items-center justify-center gap-4">
      <Input class="max-w-xl" v-model="code" />
      <Button @click="sendVerification"> Enviar</Button>
    </div>
    </div>
  </div>
</template>