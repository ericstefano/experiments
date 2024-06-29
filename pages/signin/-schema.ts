import * as v from 'valibot'

export const emailSchema = v
  .string('Por favor, preencha o campo de e-mail.', [
    v.email('Por favor, insira um e-mail válido.'),
  ])

export const passwordSchema = v
  .string('Por favor, preencha o campo de senha.', [
    v.minLength(8, 'Por favor, insira uma senha válida com pelo menos 8 caracteres.'),
  ])