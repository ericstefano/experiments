// Argon2 cannot be used in Cloudflare Workers context (because it's pure JavaScript)
// See https://community.cloudflare.com/t/options-for-password-hashing/138077
// import { hash } from '@node-rs/argon2'

// OWASP recommends using Scrypt when Argon2 is not an option
// See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
import { Scrypt } from 'lucia'

const scrypt = new Scrypt()

export function useScrypt() {
  return scrypt
}
