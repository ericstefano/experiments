<script lang="ts" setup>
import { useForm, configure, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot';
import FormItem from '~/components/ui/form/FormItem.vue';

// using valibot because of this issue: https://github.com/logaretm/vee-validate/issues/4208
const fields = {
    fullname: v
        .string('Por favor, preencha o campo de nome.', [
            v.minLength(2, 'Por favor, insira um nome válido com pelo menos 2 caracteres.'),
            v.maxLength(50, 'Por favor, reduza seu nome para 50 caracteres ou menos.'),
            v.regex(/^[\p{L}\s]+$/u, 'Por favor, insira somente letras no seu nome.'),
            v.toTrimmed()
        ]),
    email: v
        .string('Por favor, preencha o campo de e-mail.', [
            v.email('Por favor, insira um e-mail válido.'),
            v.toTrimmed()
        ]),
    password: v
        .string('Por favor, insira uma senha válida.', [
            v.minLength(8, 'Por favor, insira uma senha válida com pelo menos 8 caracteres.'),
            v.toTrimmed()
        ]),
    confirm: v
        .string('Por favor, insira a confirmação de senha.', [
            v.toTrimmed()
        ]),
    terms: v.
        literal(true, 'Por favor, preencha este campo para continuar.'),
    shift: v.
        picklist(['morning', 'afternoon', 'evening'], 'Por favor, selecione um turno.'),
    uf: v.transform(v.picklist([
        'ac', 'al', 'ap', 'am', 'ba', 'ce',
        'df', 'es', 'go', 'ma', 'mt', 'ms',
        'mg', 'pa', 'pb', 'pr', 'pe', 'pi',
        'rj', 'rn', 'rs', 'ro', 'rr', 'sc',
        'sp', 'se', 'to'
    ], 'Por favor, selecione um estado.'), (value) => value.toUpperCase())

}

const schema = v.object(fields, [
    v.forward(
        v.custom(({ password, confirm }) => {
            return password === confirm;
        }, 'Por favor, certifique-se de que a senha de confirmação corresponde à senha digitada anteriormente.'),
        ['confirm']
    ),
])
const formSchema = toTypedSchema(schema);

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

// configure({
//     bails: false,
// })

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
                            <Input type="text" placeholder="Digite o seu nome" :error="!!errorMessage"
                                v-bind="componentField" />
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
                    <FormField name="password" v-slot="{ componentField, errorMessage }" :as="FormItem">
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                            <PasswordInput placeholder="Digite a sua senha" :error="!!errorMessage"
                                v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormField>
                    <!-- Only throws error when other fields are correct -->
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
                    <FormField name="terms" type="checkbox" v-slot="{ handleChange, value }" :as="FormItem">

                        <div class="flex items-center gap-2">
                            <!-- Form control applies aria-invalid if error. Because radix-checkbox renders button first, it applies to it. -->
                            <FormControl>
                                <Checkbox @update:checked="handleChange" :checked="value" />
                            </FormControl>
                            <FormLabel>Eu aceito os termos e condições para continuar.</FormLabel>
                        </div>
                        <FormMessage />

                    </FormField>
                    <FormField v-slot="{ componentField }" name="uf" :as="FormItem">

                        <FormLabel>Estado</FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um estado" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ac">
                                        AC - Acre
                                    </SelectItem>
                                    <SelectItem value="al">
                                        AL - Alagoas
                                    </SelectItem>
                                    <SelectItem value="ap">
                                        AP - Amapá
                                    </SelectItem>
                                    <SelectItem value="am">
                                        AM - Amazonas
                                    </SelectItem>
                                    <SelectItem value="ba">
                                        BA - Bahia
                                    </SelectItem>
                                    <SelectItem value="ce">
                                        CE - Ceará
                                    </SelectItem>
                                    <SelectItem value="df">
                                        DF - Distrito Federal
                                    </SelectItem>
                                    <SelectItem value="es">
                                        ES - Espírito Santo
                                    </SelectItem>
                                    <SelectItem value="go">
                                        GO - Goiás
                                    </SelectItem>
                                    <SelectItem value="ma">
                                        MA - Maranhão
                                    </SelectItem>
                                    <SelectItem value="mt">
                                        MT - Mato Grosso
                                    </SelectItem>
                                    <SelectItem value="ms">
                                        MS - Mato Grosso do Sul
                                    </SelectItem>
                                    <SelectItem value="mg">
                                        MG - Minas Gerais
                                    </SelectItem>
                                    <SelectItem value="pa">
                                        PA - Pará
                                    </SelectItem>
                                    <SelectItem value="pb">
                                        PB - Paraíba
                                    </SelectItem>
                                    <SelectItem value="pr">
                                        PR - Paraná
                                    </SelectItem>
                                    <SelectItem value="pe">
                                        PE - Pernambuco
                                    </SelectItem>
                                    <SelectItem value="pi">
                                        PI - Piauí
                                    </SelectItem>
                                    <SelectItem value="rj">
                                        RJ - Rio de Janeiro
                                    </SelectItem>
                                    <SelectItem value="rn">
                                        RN - Rio Grande do Norte
                                    </SelectItem>
                                    <SelectItem value="rs">
                                        RS - Rio Grande do Sul
                                    </SelectItem>
                                    <SelectItem value="ro">
                                        RO - Rondônia
                                    </SelectItem>
                                    <SelectItem value="rr">
                                        RR - Roraima
                                    </SelectItem>
                                    <SelectItem value="sc">
                                        SC - Santa Catarina
                                    </SelectItem>
                                    <SelectItem value="sp">
                                        SP - São Paulo
                                    </SelectItem>
                                    <SelectItem value="se">
                                        SE - Sergipe
                                    </SelectItem>
                                    <SelectItem value="to">
                                        TO - Tocantins
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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