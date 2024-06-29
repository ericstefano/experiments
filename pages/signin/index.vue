<script lang="ts" setup>
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { emailSchema, passwordSchema } from './-schema'

// Issues:
// Using valibot instead of zod because of this issue: https://github.com/logaretm/vee-validate/issues/4208
// FormControl applies aria-invalid if error. Because radix-checkbox renders button first, it applies to it.

definePageMeta({
  middleware: [
    'retrieve-auth',
    'only-visitors',
  ],
  pageTransition: {
    name: 'page',
    mode: 'out-in',
  }
});

const fields = {
  email: emailSchema,
  password: passwordSchema,
}

const schema = v.object(fields)
const formSchema = toTypedSchema(schema)

configure({
  bails: true,
})

const { handleSubmit, setErrors } = useForm({
  validationSchema: formSchema,
})

const { setAuth } = await useAuth();

const onSubmit = handleSubmit(async (values) => {
  await $fetch('/api/signin', {
    method: 'post',
    body: values,
    async onResponse(ctx) {
      if (!ctx.response.ok) return setErrors({
        password: 'E-mail ou senha incorretos.',
        email: 'E-mail ou senha incorretos.',
      });
      const data = await ctx.response._data;
      setAuth({ isAuthorized: true, user: data })
      navigateTo('/');
    }
  })
})
</script>

<template>
  <div class="min-h-screen flex justify-center items-center p-4">
    <Card class="w-[28rem]">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Não possui cadastro? <NuxtLink class="text-blue-500 underline" to="/signup">Crie sua conta
          </NuxtLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField, errorMessage }" name="email">
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Digite o seu e-mail" :error="!!errorMessage" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="password">
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Digite a sua senha" :error="!!errorMessage" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex justify-end">
            <Button type="submit">
              Logar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
