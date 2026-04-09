<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  const { getArticle } = useArticleApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: '文章管理 — 後台管理' })
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

  fetchArticles()

  // const { getAll, remove } = useArticleData()

  const filterStatus = ref<'all' | 'published' | 'draft'>('all')
  const searchQuery = ref('')

  function setFilterStatus(value: string) {
    filterStatus.value = value as 'all' | 'published' | 'draft'
  }

  const filtered = computed(() => {
    let list = articles.value
    if (filterStatus.value !== 'all') list = list.filter((a) => a.status === filterStatus.value)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  })

  const deleteTarget = ref<Article | null>(null)

  function confirmDelete(article: Article) {
    deleteTarget.value = article
  }

  function doDelete() {
    console.log('Deleting article:')
    // if (!deleteTarget.value) return
    // remove(deleteTarget.value.id)
    // articles.value = getAll()
    // deleteTarget.value = null
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-xl font-semibold text-white mb-1">文章管理</h1>
        <p class="text-sm text-neutral-500">共 {{ articles.length }} 篇文章</p>
      </div>
      <NuxtLink
        to="/backend/articles/new"
        class="px-4 py-2 bg-neutral-100 text-neutral-900 text-sm rounded-lg hover:bg-white transition-colors font-medium"
      >
        + 新增文章
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex gap-1">
        <button
          v-for="opt in [
            { value: 'all', label: '全部' },
            { value: 'published', label: '已發布' },
            { value: 'draft', label: '草稿' }
          ]"
          :key="opt.value"
          class="px-3 py-1.5 rounded-md text-xs transition-colors"
          :class="filterStatus === opt.value ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'"
          @click="setFilterStatus(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋文章標題或標籤..."
        class="ml-auto w-56 px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
      />
    </div>

    <!-- Table -->
    <div class="bg-neutral-800/40 border border-neutral-700 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-neutral-700 text-left">
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">標題</th>
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">狀態</th>
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">標籤</th>
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">上架日期</th>
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">更新時間</th>
            <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="article in filtered"
            :key="article.id"
            class="border-b border-neutral-700/50 last:border-0 hover:bg-neutral-700/20 transition-colors group"
          >
            <td class="px-5 py-3.5">
              <NuxtLink
                :to="`/backend/articles/${article.slug}`"
                class="text-sm text-neutral-200 group-hover:text-white transition-colors line-clamp-1"
              >
                {{ article.title }}
              </NuxtLink>
              <p class="text-xs text-neutral-600 mt-0.5 truncate max-w-xs">{{ article.excerpt }}</p>
            </td>
            <td class="px-5 py-3.5">
              <span
                class="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                :class="
                  article.status === 'published'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-amber-900/50 text-amber-400'
                "
              >
                {{ article.status === 'published' ? '已發布' : '草稿' }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.5 bg-neutral-700/60 text-neutral-400 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-xs text-neutral-500">{{ formatDate(article.publishDate) }}</td>
            <td class="px-5 py-3.5 text-xs text-neutral-600">{{ formatDate(article.updatedAt) }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/backend/articles/${article.slug}`"
                  class="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  編輯
                </NuxtLink>
                <button
                  class="text-xs text-neutral-600 hover:text-rose-400 transition-colors"
                  @click="confirmDelete(article)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="px-5 py-12 text-center text-sm text-neutral-600">沒有找到符合的文章</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          @click.self="deleteTarget = null"
        >
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6 w-80 shadow-xl">
            <h3 class="text-sm font-medium text-white mb-2">確認刪除</h3>
            <p class="text-xs text-neutral-400 mb-5 leading-5">
              確定要刪除《{{ deleteTarget.title }}》嗎？此動作無法復原。
            </p>
            <div class="flex gap-3 justify-end">
              <button
                class="px-4 py-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-600 rounded-lg transition-colors"
                @click="deleteTarget = null"
              >
                取消
              </button>
              <button
                class="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                @click="doDelete"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
