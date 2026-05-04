// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const siteName = process.env.NUXT_PUBLIC_SITE_NAME || "珊珊書評 Sam's World"
const siteShortName = process.env.NUXT_PUBLIC_SITE_SHORT_NAME || '珊珊書評'
const siteDescription =
  process.env.NUXT_PUBLIC_SITE_DESCRIPTION ||
  '珊珊書評是 Samantha 的個人書寫空間，記錄閱讀感悟、生活片段與日常中值得被留下的每一刻。'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteAuthor = process.env.NUXT_PUBLIC_SITE_AUTHOR || 'Samantha Cho'
const siteLocale = process.env.NUXT_PUBLIC_SITE_LOCALE || 'zh-Hant-TW'
const titleSeparator = process.env.NUXT_PUBLIC_SITE_TITLE_SEPARATOR || '—'
const siteOgImage = process.env.NUXT_PUBLIC_SITE_OG_IMAGE || '/favicon.ico'
const contactEmail = process.env.NUXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'
const instagramUrl = process.env.NUXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/sam_readingtw/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    cloudflareR2: {
      accountId: process.env.CLOUDFLARE_STORAGE_ACCOUNT_ID,
      accessKeyId: process.env.CLOUDFLARE_STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_STORAGE_SECRET_ACCESS_KEY,
      bucketName: process.env.CLOUDFLARE_STORAGE_BUCKET_NAME,
      s3Api: process.env.CLOUDFLARE_STORAGE_S3_API,
      publicUrl: process.env.CLOUDFLARE_STORAGE_PUBLIC_URL
    },
    public: {
      site: {
        name: siteName,
        shortName: siteShortName,
        description: siteDescription,
        url: siteUrl,
        author: siteAuthor,
        locale: siteLocale,
        titleSeparator,
        ogImage: siteOgImage,
        contactEmail,
        instagramUrl
      }
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'zh-Hant' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      meta: [
        { name: 'description', content: siteDescription },
        { property: 'og:site_name', content: siteName },
        { property: 'og:url', content: siteUrl },
        { property: 'og:locale', content: siteLocale },
        { property: 'og:image', content: siteOgImage },
        { name: 'twitter:card', content: 'summary' },
        { name: 'author', content: siteAuthor }
      ]
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  site: {
    url: siteUrl
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/backend/**']
  },

  modules: ['nuxt-svgo-loader', '@nuxtjs/sitemap'],

  nitro: {
    preset: 'vercel',
    plugins: ['~~/server/db/index.js']
  }
})
