import * as v from 'valibot'
import { ACCEPTED_IMAGE_FILE_EXTENSIONS, ACCEPTED_IMAGE_MIME_TYPES, BRAZILIAN_STATES, MAX_IMAGE_FILE_SIZE } from '~/constants/'

const UFS = BRAZILIAN_STATES.map(({ uf }) => uf)

export const fullnameSchema = v
  .string('Por favor, preencha o campo de nome.', [
    v.minLength(2, 'Po r favor, insira um nome com pelo menos 2 caracteres.'),
    v.maxLength(25, 'Por favor, reduza seu nome para 50 caracteres ou menos.'),
    v.regex(/^[\p{L}\s]+$/u, 'Por favor, insira somente letras no seu nome.'),
    v.toTrimmed(),
  ])

export const emailSchema = v
  .string('Por favor, preencha o campo de e-mail.', [
    v.email('Por favor, insira um e-mail válido.'),
  ])

export const passwordSchema = v
  .string('Por favor, preencha o campo de senha.', [
    v.minLength(8, 'Por favor, insira uma senha válida com pelo menos 8 caracteres.'),
  ])

export const confirmSchema = v
  .string('Por favor, preencha o campo de confirmação de senha.', [
    v.minLength(8, 'Por favor, preencha o campo de confirmação de senha.'),
  ])

export const imageSchema = v
  .instance(File, 'Por favor, insira uma imagem.', [
    v.mimeType(ACCEPTED_IMAGE_MIME_TYPES, 'Por favor, selecione um arquivo de imagem.'),
    v.maxSize(MAX_IMAGE_FILE_SIZE, 'Por favor, selecione uma imagem menor que 5 MB.'),
    v.custom((file) => {
      return ACCEPTED_IMAGE_FILE_EXTENSIONS.includes(getFileExtension(file.name))
    }, 'Por favor, selecione um arquivo de imagem.'),
  ])

export const termsSchema = v
  .literal(true, 'Por favor, preencha para continuar.')

export const shiftSchema = v
  .picklist(['morning', 'afternoon', 'evening'], 'Por favor, selecione um turno.')

export const ufSchema = v
  .picklist(UFS, 'Por favor, selecione um estado.')
