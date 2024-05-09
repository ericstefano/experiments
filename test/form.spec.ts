import { describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'

await setup({
  browser: true,
  dev: true,
  server: true,
  browserOptions: {
    type: 'chromium', // webkit doesnt work
  },
})

describe('e2e example suite', async () => {
  it('e2e example test', async () => {
    const page = await createPage('/form', {})
    const text = await page.getByRole('heading', { name: 'Comece agora', level: 3 }).textContent()
    expect(text).toContain('Comece agora')
    await page.close()
  })
})
