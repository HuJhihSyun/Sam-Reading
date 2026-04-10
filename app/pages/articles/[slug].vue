<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  import type { Article } from '@/types'
  const { getArticleBySlug } = useArticleApi()
  const { buildPageTitle, defaultDescription } = useSiteConfig()

  const route = useRoute()

  const slug = route.params.slug as string

  const article = ref(null as Article | null)

  const { data: articleData } = await useAsyncData(`article-${slug}`, () => getArticleBySlug(slug))

  article.value = articleData.value?.data || null

  const pageTitle = buildPageTitle(article.value?.title)
  const pageDescription = article.value
    ? article.value.content.trim().replace(/\*\*/g, '').slice(0, 120).trimEnd() + '…'
    : defaultDescription

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: 'article',
    twitterCard: 'summary',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription
  })
</script>

<template>
  <div v-if="article" class="min-h-full">
    <!-- Header canvas -->
    <div class="relative h-56 overflow-hidden bg-petal-50">
      <canvas-sparkles class="absolute inset-0" />
      <canvas-wave-canvas class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-10 pb-8">
        <div class="max-w-xl">
          <div class="flex gap-2 mb-3">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="text-xs bg-white/60 text-petal-500 px-3 py-0.5 rounded-full border border-petal-100"
              >{{ tag }}</span
            >
          </div>
          <h1 class="font-display text-3xl text-mauve-800 leading-tight">{{ article.title }}</h1>
          <div class="flex items-center gap-3 mt-2 text-xs text-mauve-400">
            <span>{{ article.publishDate }}</span>
            <span class="text-petal-200">·</span>
            <span>{{ article.readTime || 0 }} 閱讀</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back link -->
    <div class="px-10 pt-6">
      <NuxtLink
        to="/articles"
        class="inline-flex items-center gap-1.5 text-xs text-mauve-400 hover:text-petal-500 transition-colors"
      >
        <span>←</span> 返回文章列表
      </NuxtLink>
    </div>

    <!-- Article content -->
    <article class="px-10 py-8 max-w-xl">
      <div class="space-y-5 text-mauve-700 leading-8 text-[15px]" v-html="article.content"></div>

      <!-- End decoration -->
      <div class="flex items-center gap-4 mt-12 mb-2">
        <div class="flex-1 h-px bg-petal-100" />
        <span class="text-petal-300 text-xs">✦</span>
        <div class="flex-1 h-px bg-petal-100" />
      </div>
      <p class="text-center text-xs text-mauve-300 tracking-widest">感謝閱讀</p>
    </article>
  </div>
</template>
