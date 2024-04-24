<script lang="ts" setup>
import { configure, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot';
import FormItem from '~/components/ui/form/FormItem.vue';

// Issues:
// Using valibot instead of zod because of this issue: https://github.com/logaretm/vee-validate/issues/4208
// Using a Map "cache" because VeeValidate or Valibot dispares a request on every field input change to validate phone.
// Password confirm field only throws error when other fields are correct.
// FormControl applies aria-invalid if error. Because radix-checkbox renders button first, it applies to it.

const phoneCache = ref(new Map<string, boolean>());

async function validatePhone(number: string) {
    return $fetch('/api/phone', {
      method: 'post',
      body: {
        number,
      }
    })
}

function parsePhone(number: string) {
  return number.replaceAll(/[\(\)\- ]/g, '');
}

async function handleValidatePhone(number: string) {
  const parsed = parsePhone(number);
  if (parsed.length < 11) return false;
  if (phoneCache.value.has(parsed)) return !!phoneCache.value.get(parsed);
  const response = await validatePhone(parsed);
  const valid = response && !!response.valid;
  phoneCache.value.set(parsed, valid);
  return valid;
}

const fields = {
  fullname: v
    .string('Por favor, preencha o campo de nome.', [
      v.minLength(2, 'Por favor, insira um nome com pelo menos 2 caracteres.'),
      v.maxLength(25, 'Por favor, reduza seu nome para 50 caracteres ou menos.'),
      v.regex(/^[\p{L}\s]+$/u, 'Por favor, insira somente letras no seu nome.'),
      v.toTrimmed()
    ]),
  email: v
    .string('Por favor, preencha o campo de e-mail.', [
      v.email('Por favor, insira um e-mail válido.'),
      v.toTrimmed()
    ]),
  phone: v
    .stringAsync('Por favor, preencha o campo de celular.',
      [v.toCustom(parsePhone), v.customAsync(handleValidatePhone, 'Por favor, insira um número válido.')]),
  password: v
    .string('Por favor, preencha o campo de senha.', [
      v.minLength(8, 'Por favor, insira uma senha válida com pelo menos 8 caracteres.'),
    ]),
  confirm: v
    .string('Por favor, preencha o campo de confirmação de senha.', [
      v.minLength(8, 'Por favor, preencha o campo de confirmação de senha.'),
    ]),
  terms: v.
    literal(true, 'Por favor, preencha para continuar.'),
  shift: v.
    picklist(['morning', 'afternoon', 'evening'], 'Por favor, selecione um turno.'),
  uf: v.picklist([
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE',
    'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ], 'Por favor, selecione um estado.'),
}

const schema = v.objectAsync(fields, [
  v.forward(
    v.custom(({ password, confirm }) => {
      if (!confirm.length) return false;
      return password === confirm
    },
      'Por favor, certifique-se de que a senha de confirmação corresponde à senha digitada anteriormente.'),
    ['confirm']
  ),
])
const formSchema = toTypedSchema(schema);

configure({
  bails: false,

});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
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
        <form @submit="onSubmit" class="space-y-4">
          <FormField name="fullname" v-slot="{ errorMessage, componentField }" :as="FormItem">
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite o seu nome" :error="!!errorMessage" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="email" v-slot="{ componentField, errorMessage }" :as="FormItem">
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input placeholder="Digite o seu e-mail" :error="!!errorMessage" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="phone" v-slot="{ errorMessage, componentField }" :as="FormItem">
            <FormLabel>Celular</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite o seu celular" :error="!!errorMessage" v-bind="componentField"
                v-maska data-maska="(##) #####-####" />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="password" v-slot="{ componentField, errorMessage }" :as="FormItem">
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Digite a sua senha" :error="!!errorMessage" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="confirm" v-slot="{ componentField, errorMessage }" :as="FormItem">
            <FormLabel>Confirmação de senha</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Digite a sua confirmação de senha" :error="!!errorMessage"
                v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="shift" type="radio" v-slot="{ componentField }" :as="FormItem">
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
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="uf" :as="FormItem">
            <FormLabel>Estado</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger :error="!!errorMessage">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="AC">
                    AC - Acre
                  </SelectItem>
                  <SelectItem value="AL">
                    AL - Alagoas
                  </SelectItem>
                  <SelectItem value="AP">
                    AP - Amapá
                  </SelectItem>
                  <SelectItem value="AM">
                    AM - Amazonas
                  </SelectItem>
                  <SelectItem value="BA">
                    BA - Bahia
                  </SelectItem>
                  <SelectItem value="CE">
                    CE - Ceará
                  </SelectItem>
                  <SelectItem value="DF">
                    DF - Distrito Federal
                  </SelectItem>
                  <SelectItem value="ES">
                    ES - Espírito Santo
                  </SelectItem>
                  <SelectItem value="GO">
                    GO - Goiás
                  </SelectItem>
                  <SelectItem value="MA">
                    MA - Maranhão
                  </SelectItem>
                  <SelectItem value="MT">
                    MT - Mato Grosso
                  </SelectItem>
                  <SelectItem value="MS">
                    MS - Mato Grosso do Sul
                  </SelectItem>
                  <SelectItem value="MG">
                    MG - Minas Gerais
                  </SelectItem>
                  <SelectItem value="PA">
                    PA - Pará
                  </SelectItem>
                  <SelectItem value="PB">
                    PB - Paraíba
                  </SelectItem>
                  <SelectItem value="PR">
                    PR - Paraná
                  </SelectItem>
                  <SelectItem value="PE">
                    PE - Pernambuco
                  </SelectItem>
                  <SelectItem value="PI">
                    PI - Piauí
                  </SelectItem>
                  <SelectItem value="RJ">
                    RJ - Rio de Janeiro
                  </SelectItem>
                  <SelectItem value="RN">
                    RN - Rio Grande do Norte
                  </SelectItem>
                  <SelectItem value="RS">
                    RS - Rio Grande do Sul
                  </SelectItem>
                  <SelectItem value="RO">
                    RO - Rondônia
                  </SelectItem>
                  <SelectItem value="RR">
                    RR - Roraima
                  </SelectItem>
                  <SelectItem value="SC">
                    SC - Santa Catarina
                  </SelectItem>
                  <SelectItem value="SP">
                    SP - São Paulo
                  </SelectItem>
                  <SelectItem value="SE">
                    SE - Sergipe
                  </SelectItem>
                  <SelectItem value="TO">
                    TO - Tocantins
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormField>
          <FormField name="terms" type="checkbox" v-slot="{ handleChange, value }" :as="FormItem">
            <div class="flex items-center gap-2">
              <FormControl>
                <Checkbox @update:checked="handleChange" :checked="value" />
              </FormControl>
              <FormLabel>Eu aceito os termos e condições para continuar.</FormLabel>
            </div>
            <FormMessage />
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