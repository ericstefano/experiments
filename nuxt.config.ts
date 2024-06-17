import { pwa } from './config/pwa'
import { APP_DESCRIPTION } from './constants/index'

export default defineNuxtConfig({
  modules: [
    // '@nuxthub/core',
    'nitro-cloudflare-dev',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@nuxt/test-utils/module',
  ],

  ssr: false,

  // pwa,

  app: {
    rootId: 'app', // Hide __nuxt id
    rootTag: 'main',

    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/nuxt.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: APP_DESCRIPTION },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  // hub: {
  //   database: true,
  // },

  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },

  colorMode: {
    preference: 'system',
    classSuffix: '',
  },

  routeRules: {
    '/**': {
      headers: {
        // 'Content-Security-Policy': 'base-uri \'none\'; default-src \'none\'; connect-src \'self\' https:; font-src \'self\' https: data:; form-action \'self\'; frame-ancestors \'self\'; frame-src \'self\'; img-src \'self\' data:; manifest-src \'self\'; media-src \'self\'; object-src \'none\'; script-src-attr \'none\'; style-src \'self\' https: \'unsafe-inline\'; script-src \'self\' https: \'unsafe-inline\' \'strict-dynamic\' \'nonce-{{nonce}}\'; upgrade-insecure-requests; worker-src \'self\';',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Referrer-Policy': 'no-referrer',
        'Strict-Transport-Security': 'max-age=15552000; includeSubDomains;',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '0',
        // 'X-Powered-By': undefined, //
      },
    },
  },

  components: true,

  devtools: {
    enabled: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
