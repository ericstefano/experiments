<script lang="ts" setup>
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'


// Issues:
// Using valibot instead of zod because of this issue: https://github.com/logaretm/vee-validate/issues/4208
// Using a Map "cache" because VeeValidate or Valibot dispares a request on every field input change to validate phone.
// Password confirm field only throws error when other fields are correct.
// FormControl applies aria-invalid if error. Because radix-checkbox renders button first, it applies to it.

const phoneCache = ref(new Map<string, boolean>())

async function validatePhone(number: string) {
  return $fetch('/api/phone', {
    method: 'post',
    body: {
      number,
    },
  })
}

function parsePhone(number: string) {
  return number.replaceAll(/[\(\)\- ]/g, '')
}

async function handleValidatePhone(number: string) {
  const parsed = parsePhone(number)
  if (parsed.length < 11)
    return false
  if (phoneCache.value.has(parsed))
    return !!phoneCache.value.get(parsed)
  const response = await validatePhone(parsed)
  const valid = response && !!response.valid
  phoneCache.value.set(parsed, valid)
  return valid
}

const acceptedImageTypes: Array<`${string}/${string}`> = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]

const acceptedFileSize = 5 * 1024 * 1024 // 5MB

const states = [
  { name: 'Acre', uf: 'AC' },
  { name: 'Alagoas', uf: 'AL' },
  { name: 'Amapá', uf: 'AP' },
  { name: 'Amazonas', uf: 'AM' },
  { name: 'Bahia', uf: 'BA' },
  { name: 'Ceará', uf: 'CE' },
  { name: 'Distrito Federal', uf: 'DF' },
  { name: 'Espírito Santo', uf: 'ES' },
  { name: 'Goiás', uf: 'GO' },
  { name: 'Maranhão', uf: 'MA' },
  { name: 'Mato Grosso', uf: 'MT' },
  { name: 'Mato Grosso do Sul', uf: 'MS' },
  { name: 'Minas Gerais', uf: 'MG' },
  { name: 'Pará', uf: 'PA' },
  { name: 'Paraíba', uf: 'PB' },
  { name: 'Paraná', uf: 'PR' },
  { name: 'Pernambuco', uf: 'PE' },
  { name: 'Piauí', uf: 'PI' },
  { name: 'Rio de Janeiro', uf: 'RJ' },
  { name: 'Rio Grande do Norte', uf: 'RN' },
  { name: 'Rio Grande do Sul', uf: 'RS' },
  { name: 'Rondônia', uf: 'RO' },
  { name: 'Roraima', uf: 'RR' },
  { name: 'Santa Catarina', uf: 'SC' },
  { name: 'São Paulo', uf: 'SP' },
  { name: 'Sergipe', uf: 'SE' },
  { name: 'Tocantins', uf: 'TO' },
]

const ufs = states.map(({ uf }) => uf)

const fields = {
  fullname: v
    .string('Por favor, preencha o campo de nome.', [
      v.minLength(2, 'Por favor, insira um nome com pelo menos 2 caracteres.'),
      v.maxLength(25, 'Por favor, reduza seu nome para 50 caracteres ou menos.'),
      v.regex(/^[\p{L}\s]+$/u, 'Por favor, insira somente letras no seu nome.'),
      v.toTrimmed(),
    ]),
  email: v
    .string('Por favor, preencha o campo de e-mail.', [
      v.email('Por favor, insira um e-mail válido.'),
    ]),
  phone: v
    .stringAsync('Por favor, preencha o campo de celular.', [v.toCustom(parsePhone), v.customAsync(handleValidatePhone, 'Por favor, insira um número válido.')]),
  password: v
    .string('Por favor, preencha o campo de senha.', [
      v.minLength(8, 'Por favor, insira uma senha válida com pelo menos 8 caracteres.'),
    ]),
  confirm: v
    .string('Por favor, preencha o campo de confirmação de senha.', [
      v.minLength(8, 'Por favor, preencha o campo de confirmação de senha.'),
    ]),
  image: v
    .instance(File, 'Por favor, insira uma imagem.', [
      v.mimeType(acceptedImageTypes, 'Por favor, selecione um arquivo de imagem.'),
      v.maxSize(acceptedFileSize, 'Por favor, selecione uma imagem menor que 5 MB.'),
    ]),
  terms: v
    .literal(true, 'Por favor, preencha para continuar.'),
  shift: v
    .picklist(['morning', 'afternoon', 'evening'], 'Por favor, selecione um turno.'),
  uf: v
    .picklist(ufs, 'Por favor, selecione um estado.'),
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
  bails: false,
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
  await $fetch('/api/form', {
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
                  v-bind="componentField" data-maska="(##) #####-####"
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
                <Input type="file" v-bind="field" :error="!!errorMessage" :accept="acceptedImageTypes.join(',')" />
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
                    <SelectItem v-for="{ uf, name } in states" :key="uf" :value="uf">
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