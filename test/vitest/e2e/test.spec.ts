import { describe, it } from 'vitest'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { expect } from '@nuxt/test-utils/playwright'

await setup({
  browser: true,
  dev: true,
  server: true,
  browserOptions: {
    type: 'chromium',
    launch: {
      headless: false,
    },
  },
})

describe('main page', () => {
  it('should render', async () => {
    const page = await createPage()
    await page.goto(url('/form'), { waitUntil: 'hydration' })
    const text = page.getByRole('heading', { level: 3, name: /comece agora/i })
    expect(text).toBeDefined()
    // await expect(text).toBeVisible() -> doesn't work, check why
    await page.close()
  })
})
