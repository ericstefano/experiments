import type { H3Event } from 'h3'
import * as tables from '../database/schema'
import { getFileExtension, sanitizePhoneNumber } from '~/utils/string'

// Export commons
// Share utils between client and server

export type { H3Event }
export { getFileExtension, sanitizePhoneNumber }
export { tables }
