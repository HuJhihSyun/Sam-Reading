<script setup lang="ts">
  import { useSiteConfig } from '@/composables/useSiteConfig'
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
    ogImage: article.value?.coverImage || undefined,
    ogType: 'article',
    twitterCard: article.value?.coverImage ? 'summary_large_image' : 'summary',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: article.value?.coverImage || undefined
  })
</script>

<template>
  <div v-if="article" class="min-h-full">
    <!-- Header: cover image hero or canvas fallback -->
    <div v-if="article.coverImage" class="relative overflow-hidden h-56 lg:h-72 xl:h-88 bg-neutral-900">
      <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover object-center" />
      <!-- gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div class="absolute inset-0 flex items-end px-10 pb-10">
        <div class="max-w-2xl">
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="text-xs bg-white/20 text-white/90 px-3 py-0.5 rounded-full border border-white/20 backdrop-blur-sm"
              >{{ tag }}</span
            >
          </div>
          <h1 class="font-display text-3xl md:text-4xl text-white leading-tight drop-shadow-md">{{ article.title }}</h1>
          <div class="flex items-center gap-3 mt-3 text-xs text-white/60">
            <span>{{ article.publishDate }}</span>
            <span class="text-white/30">·</span>
            <span>{{ article.readTime || 0 }} 閱讀</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Header canvas (no cover image) -->
    <div v-else class="relative h-56 overflow-hidden bg-petal-50">
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
      <div class="article-body space-y-5 text-mauve-700 leading-8 text-[15px]" v-html="article.content"></div>

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

<style scoped>
/* ── Headings ─────────────────────────────────────────────── */
.article-body :deep(h1) {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
  color: #3c2e26;
  margin: 2rem 0 0.75rem;
  letter-spacing: -0.01em;
}
.article-body :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: #3c2e26;
  margin: 1.75rem 0 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #e4cdb8;
}
.article-body :deep(h3) {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.4;
  color: #584438;
  margin: 1.5rem 0 0.5rem;
}
.article-body :deep(h4) {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  color: #725c4a;
  margin: 1.25rem 0 0.4rem;
  letter-spacing: 0.03em;
}
.article-body :deep(h5) {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.5;
  color: #907862;
  margin: 1rem 0 0.3rem;
  letter-spacing: 0.04em;
}
.article-body :deep(h6) {
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.5;
  color: #b09882;
  margin: 0.75rem 0 0.25rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Paragraph ────────────────────────────────────────────── */
.article-body :deep(p) {
  margin: 0.6rem 0;
}

/* ── Blockquote ───────────────────────────────────────────── */
.article-body :deep(blockquote) {
  border-left: 3px solid #d4ad98;
  background-color: #fdfaf2;
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0 0.375rem 0.375rem 0;
  color: #907862;
  font-style: italic;
  line-height: 1.8;
}
.article-body :deep(blockquote p) {
  margin: 0;
}

/* ── Horizontal rule ──────────────────────────────────────── */
.article-body :deep(hr) {
  border: none;
  border-top: 1px solid #e4cdb8;
  margin: 2rem 0;
}

/* ── Lists ────────────────────────────────────────────────── */
.article-body :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}
.article-body :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}
.article-body :deep(li) {
  margin: 0.3rem 0;
  line-height: 1.75;
}
.article-body :deep(li::marker) {
  color: #d4ad98;
}

/* ── Code ─────────────────────────────────────────────────── */
.article-body :deep(pre) {
  background: #2c2018;
  border: 1px solid #3c2e26;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
  font-size: 0.8rem;
  color: #e4cdb8;
  margin: 1.25rem 0;
  white-space: pre-wrap;
  overflow-x: auto;
  line-height: 1.7;
}
.article-body :deep(code) {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
  font-size: 0.82em;
  background: #f0e3cc;
  color: #7e5248;
  padding: 0.1em 0.4em;
  border-radius: 0.25rem;
}
.article-body :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
  border-radius: 0;
}

/* ── Links ────────────────────────────────────────────────── */
.article-body :deep(a) {
  color: #a06e60;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: #d4ad98;
  transition: color 0.15s, text-decoration-color 0.15s;
}
.article-body :deep(a:hover) {
  color: #7e5248;
  text-decoration-color: #a06e60;
}

/* ── Images ───────────────────────────────────────────────── */
.article-body :deep(img) {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1.25rem 0;
  display: block;
}

/* ── Inline styles ────────────────────────────────────────── */
.article-body :deep(strong) {
  font-weight: 700;
  color: #584438;
}
.article-body :deep(em) {
  font-style: italic;
  color: #907862;
}
.article-body :deep(sup),
.article-body :deep(sub) {
  font-size: 0.7em;
  line-height: 0;
}
</style>
