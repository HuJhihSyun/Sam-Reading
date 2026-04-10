<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  import { useContactApi } from '@/composables/api/useContactApi'
  import type { Article, ContactMessage } from '@/types'
  const { getArticle } = useArticleApi()
  const { getContact } = useContactApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: 'Dashboard — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

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

  const contacts = ref<ContactMessage[]>([])
  const unread = ref(0)

  const fetchContact = async () => {
    isLoading.value = true
    try {
      const res: any = await getContact()
      contacts.value = res.data || []
      unread.value = res.data.filter((m: any) => !m.read).length
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchArticles()
    fetchContact()
  })

  const publishedCount = computed(() => articles.value.filter((a) => a.status === 'published').length)
  const draftCount = computed(() => articles.value.filter((a) => a.status === 'draft').length)

  const recentArticles = computed(() =>
    [...articles.value].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
  )

  const recentContacts = computed(() =>
    [...contacts.value].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()).slice(0, 3)
  )

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
  }
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-white mb-1">Dashboard</h1>
    <p class="text-sm text-neutral-500 mb-8">歡迎回來，Samantha</p>

    <!-- Stats row -->
    <div class="grid grid-cols-4 gap-4 mb-10">
      <div class="bg-neutral-800/60 border border-neutral-700 rounded-xl p-5">
        <p class="text-xs text-neutral-500 tracking-widest uppercase mb-3">全部文章</p>
        <p class="text-3xl font-light text-white">{{ articles.length }}</p>
      </div>
      <div class="bg-neutral-800/60 border border-neutral-700 rounded-xl p-5">
        <p class="text-xs text-neutral-500 tracking-widest uppercase mb-3">已發布</p>
        <p class="text-3xl font-light text-emerald-400">{{ publishedCount }}</p>
      </div>
      <div class="bg-neutral-800/60 border border-neutral-700 rounded-xl p-5">
        <p class="text-xs text-neutral-500 tracking-widest uppercase mb-3">草稿</p>
        <p class="text-3xl font-light text-amber-400">{{ draftCount }}</p>
      </div>
      <div class="bg-neutral-800/60 border border-neutral-700 rounded-xl p-5">
        <p class="text-xs text-neutral-500 tracking-widest uppercase mb-3">未讀訊息</p>
        <p class="text-3xl font-light text-rose-400">{{ unread }}</p>
      </div>
    </div>

    <!-- Two columns -->
    <div class="grid grid-cols-5 gap-6">
      <!-- Recent articles -->
      <div class="col-span-3 bg-neutral-800/40 border border-neutral-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-medium text-neutral-300">最近文章</h2>
          <NuxtLink to="/backend/articles" class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >查看全部 →</NuxtLink
          >
        </div>
        <ul class="space-y-3">
          <li v-for="article in recentArticles" :key="article.id" class="flex items-center gap-3 group">
            <span
              class="text-[10px] px-1.5 py-0.5 rounded"
              :class="
                article.status === 'published' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'
              "
            >
              {{ article.status === 'published' ? '已發布' : '草稿' }}
            </span>
            <NuxtLink
              :to="`/backend/articles/${article.slug}`"
              class="flex-1 text-sm text-neutral-300 truncate group-hover:text-white transition-colors"
            >
              {{ article.title }}
            </NuxtLink>
            <span class="text-xs text-neutral-600 shrink-0">{{ formatDate(article.updatedAt) }}</span>
          </li>
        </ul>
        <NuxtLink
          to="/backend/articles/new"
          class="mt-5 flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 border border-dashed border-neutral-700 rounded-lg px-4 py-2.5 transition-colors w-full"
        >
          <span class="text-base leading-none">+</span> 新增文章
        </NuxtLink>
      </div>

      <!-- Recent contacts -->
      <div class="col-span-2 bg-neutral-800/40 border border-neutral-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-medium text-neutral-300">最新訊息</h2>
          <NuxtLink to="/backend/contacts" class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >查看全部 →</NuxtLink
          >
        </div>
        <ul class="space-y-4">
          <li
            v-for="msg in recentContacts"
            :key="msg.id"
            class="border-b border-neutral-700/50 pb-4 last:border-0 last:pb-0"
          >
            <div class="flex items-center gap-2 mb-1">
              <span v-if="!msg.read" class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span class="text-xs font-medium text-neutral-300">{{ msg.name }}</span>
              <span class="text-xs text-neutral-600 ml-auto">{{ formatDate(msg.receivedAt) }}</span>
            </div>
            <p class="text-xs text-neutral-500 line-clamp-2 leading-5">{{ msg.message }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
