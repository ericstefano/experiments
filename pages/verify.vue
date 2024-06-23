<script lang="ts" setup> 
  const code = ref('');
  function sendVerification() {
    $fetch('/api/verify-email', {
      body: {
        code: code.value
      },
      method: 'POST',
    })
  }
</script>

<template>
  <div class="flex items-center justify-center h-screen w-screen bg-black">

    <Input class="max-w-xl" v-model="code"/>
    <Button @click="sendVerification" class="ml-4"> Enviar</Button>
  </div>
</template>