<script lang="ts" setup>
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { validatePhoneNumber } from './-api'
import { confirmSchema, emailSchema, fullnameSchema, imageSchema, passwordSchema, shiftSchema, termsSchema, ufSchema } from './-schema'
import { ACCEPTED_IMAGE_MIME_TYPES, BRAZILIAN_PHONE_MASK, BRAZILIAN_STATES } from '~/constants/'

// Issues:
// Using valibot instead of zod because of this issue: https://github.com/logaretm/vee-validate/issues/4208
// Using a Map "cache" because VeeValidate or Valibot dispares a request on every field input change to validate phone.
// Password confirm field only throws error when other fields are correct.
// FormControl applies aria-invalid if error. Because radix-checkbox renders button first, it applies to it.

// Alternative to use worker:
// import Test from '~/assets/workers/test.worker?worker'
// const { data, worker, post, terminate } = useWebWorker(new Test())

// Another alternative to use worker:
// const url = new URL('~/assets/workers/test.worker.ts', import.meta.url).href
// const { data, worker, post, terminate } = useWebWorker(url, {
//   type: 'module',
// })

import Test from '~/assets/workers/test.worker.ts?worker&url'

const { worker } = useWebWorker(Test, {
  type: 'module',
})
worker.value?.postMessage('oi')

const phoneCache = shallowRef(new Map<string, boolean>())

const debouncedValidatePhoneNumber = useDebounceFn(validatePhoneNumber, 1000)

async function handleValidatePhone(number: string) {
  const sanitized = sanitizePhoneNumber(number)
  if (phoneCache.value.has(sanitized))
    return !!phoneCache.value.get(sanitized)
  const response = await debouncedValidatePhoneNumber(sanitized)
  const valid = response && !!response.valid
  phoneCache.value.set(sanitized, valid)
  return valid
}

const phoneSchema = v
  .stringAsync('Por favor, preencha o campo de celular.', [v.toCustom(sanitizePhoneNumber), v.customAsync(handleValidatePhone, 'Por favor, insira um número válido.')])

const fields = {
  fullname: fullnameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirm: confirmSchema,
  image: imageSchema,
  terms: termsSchema,
  shift: shiftSchema,
  uf: ufSchema,
}

const schema = v.objectAsync(fields, [
  v.forward(
    v.custom(({ password, confirm }) => {
      if (!confirm.length)
        return false
      return password === confirm
    }, 'Por favor, certifique-se de que a senha de confirmação corresponde à senha digitada anteriormente.'),
    ['confirm'],
  ),
])
const formSchema = toTypedSchema(schema)

configure({
  bails: true,
})

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

function objectToFormData(obj: Record<string, string | number | boolean | Blob>): FormData {
  const formData = new FormData()
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (value instanceof File || typeof value === 'string')
        formData.append(key, value)
      else
        formData.append(key, value.toString())
    }
  }
  return formData
}

const onSubmit = handleSubmit(async (values) => {
  const form = objectToFormData(values)
  console.log('values', values)
  console.log('form', form)
  await $fetch('/api/signup', {
    method: 'post',
    body: form,
  })
})
</script>

<template>
  <div class="min-h-screen w-screen flex justify-center items-center p-4">
    <Card class="w-[28rem]">
      <CardHeader>
        <CardTitle>Comece agora</CardTitle>
        <CardDescription>Crie sua conta gratuita em apenas alguns passos simples</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ errorMessage, componentField }" name="fullname">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite o seu nome" :error="!!errorMessage" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="email">
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Digite o seu e-mail" :error="!!errorMessage" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ errorMessage, componentField }" name="phone">
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input
                  v-maska type="text" placeholder="Digite o seu celular" :error="!!errorMessage"
                  v-bind="componentField" :data-maska="BRAZILIAN_PHONE_MASK"
                />
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
          <FormField v-slot="{ componentField, errorMessage }" name="confirm">
            <FormItem>
              <FormLabel>Confirmação de senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Digite a sua confirmação de senha" :error="!!errorMessage"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ errorMessage, field }" name="image" type="file">
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <Input
                  type="file" v-bind="field" :error="!!errorMessage"
                  :accept="ACCEPTED_IMAGE_MIME_TYPES.join(',')"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="shift" type="radio">
            <FormItem>
              <FormLabel>Turno preferido</FormLabel>
              <RadioGroup v-bind="componentField">
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="morning" />
                  </FormControl>
                  <FormLabel>
                    Manhã
                  </FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="afternoon" />
                  </FormControl>
                  <FormLabel>
                    Tarde
                  </FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="evening" />
                  </FormControl>
                  <FormLabel>
                    Noite
                  </FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="uf">
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger :error="!!errorMessage">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="{ uf, name } in BRAZILIAN_STATES" :key="uf" :value="uf">
                      {{ uf }} - {{ name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ handleChange, value }" name="terms" type="checkbox">
            <FormItem>
              <div class="flex items-center gap-2">
                <FormControl>
                  <Checkbox :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormLabel>Eu aceito os termos e condições para continuar.</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex justify-end">
            <Button type="submit">
              Cadastrar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
