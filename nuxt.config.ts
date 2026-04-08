// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'zh-Hant' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      meta: [
        { property: 'og:site_name', content: "珊珊書評 Sam's World" },
        { name: 'twitter:card', content: 'summary' },
        { name: 'author', content: 'Samantha Cho' }
      ]
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  modules: ['nuxt-svgo-loader'],

  nitro: {
    plugins: ['~/server/db/index.js']
  }
})
