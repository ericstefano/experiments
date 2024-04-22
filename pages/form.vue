<script lang="ts" setup>
import { useForm, configure, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot';

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
    terms: v.literal(true, 'Por favor, preencha este campo para continuar.')
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

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
})

configure({
    bails: false,
})

const onSubmit = handleSubmit((values) => {
    console.log('Form submitted!', values)
})
</script>

<template>
    <div class="h-screen w-screen flex justify-center items-center p-4">
        <Card class="w-[28rem]">
            <CardHeader>
                <CardTitle>Comece agora</CardTitle>
                <CardDescription>Crie sua conta gratuita em apenas alguns passos simples</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit="onSubmit" class="space-y-4">
                    <FormField name="fullname" v-slot="{ componentField, errorMessage }">
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Digite o seu nome" :error="!!errorMessage"
                                    v-bind="componentField" />
                            </FormControl>
                            <FormDescription :error="!!errorMessage" v-if="!!errorMessage">
                                {{ errorMessage }}
                            </FormDescription>
                        </FormItem>
                    </FormField>
                    <FormField name="email" v-slot="{ componentField, errorMessage }">
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o seu e-mail" :error="!!errorMessage"
                                    v-bind="componentField" />
                            </FormControl>
                            <FormDescription :error="!!errorMessage" v-if="!!errorMessage">
                                {{ errorMessage }}
                            </FormDescription>
                        </FormItem>
                    </FormField>
                    <FormField name="password" v-slot="{ componentField, errorMessage }">
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Digite a sua senha" :error="!!errorMessage"
                                    v-bind="componentField" />
                            </FormControl>
                            <FormDescription :error="!!errorMessage" v-if="!!errorMessage">
                                {{ errorMessage }}
                            </FormDescription>
                        </FormItem>
                    </FormField>
                    <FormField name="confirm" v-slot="{ componentField, errorMessage }">
                        <FormItem>
                            <FormLabel>Confirmação de senha</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Digite a sua confirmação de senha" :error="!!errorMessage"
                                    v-bind="componentField" />
                            </FormControl>
                            <FormDescription :error="!!errorMessage" v-if="!!errorMessage">
                                {{ errorMessage }}
                            </FormDescription>
                        </FormItem>
                    </FormField>
                    <FormField name="terms" v-slot="{ componentField, errorMessage, handleChange }">
                        <FormItem>
                            <div class="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox id="terms" v-bind="componentField" @update:checked="handleChange" />
                                </FormControl>
                                <Label for="terms">Eu aceito os termos e condições para continuar.</Label>
                            </div>
                            <FormDescription :error="!!errorMessage" v-if="!!errorMessage">
                                {{ errorMessage }}
                            </FormDescription>
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