<script setup lang="ts">
  import { useBlogConfig } from '@/composables/useBlogConfig'
  import { useArticleApi } from '@/composables/api/useArticleApi'
  import type { Article } from '@/types'
  const { getArticle } = useArticleApi()
  const { buildPageTitle } = useBlogConfig()

  const pageTitle = buildPageTitle('全部文章')
  const pageDescription = '瀏覽所有文章——閱讀筆記、生活感悟與日常書寫，按標籤篩選你感興趣的主題。'

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription
  })

  const isLoading = ref(false)
  const articles = ref<Article[]>([])

  const fetchArticles = async () => {
    isLoading.value = true
    try {
      const res: any = await getArticle()
      articles.value = res.data || []
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      isLoading.value = false
    }
  }

  fetchArticles()

  const selectedTag = ref('')
  const allTags = computed(() => [...new Set(articles.value.flatMap((a) => a.tags))])

  const filtered = computed(() =>
    selectedTag.value ? articles.value.filter((a) => a.tags.includes(selectedTag.value)) : articles.value
  )
</script>

<template>
  <div class="min-h-full">
    <!-- Header canvas -->
    <div class="relative h-48 overflow-hidden bg-petal-50">
      <canvas-wave-canvas class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-5 md:px-10 pb-8">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-1">Articles</p>
          <h1 class="font-display text-3xl text-mauve-800">全部文章</h1>
        </div>
      </div>
    </div>

    <!-- Filter tags -->
    <div class="px-5 md:px-10 pt-8 pb-4">
      <div class="flex flex-wrap gap-1.5 md:gap-2 items-center">
        <span class="text-xs text-mauve-400 mr-1 tracking-wide">篩選：</span>
        <button
          class="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs border transition-all"
          :class="
            selectedTag === ''
              ? 'bg-petal-400 text-white border-petal-400'
              : 'border-petal-200 text-mauve-500 hover:border-petal-300'
          "
          @click="selectedTag = ''"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs border transition-all"
          :class="
            selectedTag === tag
              ? 'bg-petal-400 text-white border-petal-400'
              : 'border-petal-200 text-mauve-500 hover:border-petal-300'
          "
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Article list -->
    <div class="px-5 md:px-10 pb-12">
      <TransitionGroup name="list" tag="div" class="space-y-4 mt-4">
        <NuxtLink
          v-for="article in filtered"
          :key="article.slug"
          :to="`/articles/${article.slug}`"
          class="block p-6 rounded-2xl border border-petal-100 bg-white hover:border-petal-200 hover:shadow-sm hover:shadow-petal-100 transition-all duration-200 group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="font-display text-lg text-mauve-800 group-hover:text-mauve-700 mb-2 leading-snug">
                {{ article.title }}
              </h2>
              <p class="text-sm text-mauve-500 leading-6 line-clamp-2">{{ article.excerpt }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-xs text-mauve-300">{{ article.publishDate }}</span>
                <span class="text-petal-200">·</span>
                <div class="flex gap-1.5">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="text-xs text-petal-500 bg-petal-50 px-2 py-0.5 rounded-full"
                    >{{ tag }}</span
                  >
                </div>
              </div>
            </div>
            <span class="text-petal-300 group-hover:text-petal-400 transition-colors mt-1 shrink-0">→</span>
          </div>
        </NuxtLink>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(6px);
  }
</style>
