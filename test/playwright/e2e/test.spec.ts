import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
})

test('should render', async ({ page, goto }) => {
  await goto('/form', { waitUntil: 'hydration' })
  const text = page.getByRole('heading', { level: 3, name: /comece agora/i })
  await expect(text).toBeVisible()
  await page.close()
})
