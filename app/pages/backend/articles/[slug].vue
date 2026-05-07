<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  import { useCommentApi } from '@/composables/api/useCommentApi'
  import type { Article, Comment } from '@/types'
  const { getArticleBySlug, getArticle, updateArticle } = useArticleApi()
  const { getCommentsBySlug, toggleVisible, deleteComment } = useCommentApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: '編輯文章 — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

  const route = useRoute()

  const article = ref<Article | null>(null)

  const form = reactive({
    title: '',
    publishDate: '',
    tags: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    coverImage: ''
  })

  const isLoading = ref(false)

  const fetchArticleBySlug = async (slug: string) => {
    isLoading.value = true
    try {
      const res = await getArticleBySlug(slug)
      article.value = res.data as Article

      Object.assign(form, {
        title: article.value.title,
        publishDate: article.value.publishDate,
        tags: article.value.tags.join(', '),
        slug: article.value.slug,
        excerpt: article.value.excerpt,
        content: article.value.content,
        status: article.value.status,
        coverImage: article.value.coverImage ?? ''
      })
    } catch (error) {
      console.error('Error fetching articles:', error)
      navigateTo('/articles', { replace: true })
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    const slug = route.params.slug as string
    await fetchArticleBySlug(slug)
    await fetchComments(slug)
  })

  useHead(computed(() => ({ title: article.value ? `編輯：${article.value.title} — 後台管理` : '編輯文章' })))

  const saving = ref(false)
  const saved = ref(false)
  const errors = reactive<Record<string, string>>({})

  function validate(): boolean {
    Object.keys(errors).forEach((k) => delete errors[k])
    if (!form.title.trim()) errors.title = '請填寫文章標題'
    if (!form.publishDate) errors.publishDate = '請選擇上架日期'
    return Object.keys(errors).length === 0
  }

  async function save() {
    if (!validate() || !article.value) return
    const slug = route.params.slug as string
    saving.value = true
    await new Promise((r) => setTimeout(r, 300))
    const tags = form.tags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    const updated = await update(slug, {
      title: form.title,
      publishDate: form.publishDate,
      tags,
      slug: form.slug || article.value.slug,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      coverImage: form.coverImage
    })
    if (updated) article.value = updated
    saving.value = false
    saved.value = true
    await updateArticle(slug, updated)
  }

  const update = async (slug: string, data: any) => {
    const res = await getArticle()
    const articles: Article[] = res.data as Article[]
    const idx = articles.findIndex((a: Article) => a.slug === slug)
    if (idx === -1) return null
    const foundArticle = articles[idx]
    const updated: Article = {
      ...foundArticle,
      ...data,
      id: foundArticle?.id,
      createdAt: foundArticle?.createdAt,
      updatedAt: new Date().toISOString(),
      slug: data.slug || foundArticle.slug
    }
    articles[idx] = updated
    return updated
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[\s\u3000]+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fff]/g, '')
      .slice(0, 60)
  }

  // \u2500\u2500 Comments \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const comments = ref<Comment[]>([])
  const commentsLoading = ref(false)
  const togglingId = ref<string | null>(null)
  const deletingId = ref<string | null>(null)

  const fetchComments = async (slug: string) => {
    commentsLoading.value = true
    try {
      const res = await getCommentsBySlug(slug)
      comments.value = res.data ?? []
    } catch {
      comments.value = []
    } finally {
      commentsLoading.value = false
    }
  }

  const handleToggle = async (comment: Comment) => {
    const slug = route.params.slug as string
    togglingId.value = comment.id
    try {
      const res = await toggleVisible(slug, comment.id, !comment.visible)
      const idx = comments.value.findIndex((c) => c.id === comment.id)
      if (idx !== -1) comments.value[idx] = res.data
    } finally {
      togglingId.value = null
    }
  }

  const handleDelete = async (comment: Comment) => {
    const slug = route.params.slug as string
    if (!confirm(`\u78ba\u5b9a\u8981\u522a\u9664 ${comment.name} \u7684\u7559\u8a00\uff1f`)) return
    deletingId.value = comment.id
    try {
      await deleteComment(slug, comment.id)
      comments.value = comments.value.filter((c) => c.id !== comment.id)
    } finally {
      deletingId.value = null
    }
  }

  const visibleCount = computed(() => comments.value.filter((c) => c.visible).length)
</script>

<template>
  <div class="flex flex-col lg:flex-row justify-center items-start gap-6">
    <div class="w-full lg:w-2/3">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/backend/articles" class="text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
          >← 返回列表</NuxtLink
        >
        <h1 class="text-xl font-semibold text-white">編輯文章</h1>
        <span
          v-if="article"
          class="ml-2 text-[10px] px-2 py-0.5 rounded-full"
          :class="
            article.status === 'published' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'
          "
        >
          {{ article.status === 'published' ? '已發佈' : '草稿' }}
        </span>
        <div class="ml-auto text-xs text-neutral-600" v-if="article">
          上次更新：{{ new Date(article.updatedAt).toLocaleString('zh-TW') }}
        </div>
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">文章標題 *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="輸入文章標題"
            class="w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            :class="errors.title ? 'border-rose-500' : 'border-neutral-700'"
          />
          <p v-if="errors.title" class="text-xs text-rose-400 mt-1">{{ errors.title }}</p>
        </div>

        <!-- Date + Status row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">上架日期 *</label>
            <input
              v-model="form.publishDate"
              type="date"
              class="w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
              :class="errors.publishDate ? 'border-rose-500' : 'border-neutral-700'"
            />
            <p v-if="errors.publishDate" class="text-xs text-rose-400 mt-1">{{ errors.publishDate }}</p>
          </div>
          <div>
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">發佈狀態</label>
            <select
              v-model="form.status"
              class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            >
              <option value="draft">草稿</option>
              <option value="published">發佈</option>
            </select>
          </div>
        </div>

        <!-- Tags + Slug -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase"
              >標籤 <span class="text-[10px] normal-case text-neutral-600">(用逗號或空白分隔)</span></label
            >
            <input
              v-model="form.tags"
              type="text"
              placeholder="生活, 閱讀, 日常"
              class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase"
              >文章 ID <span class="text-[10px] normal-case text-neutral-600">(用於顯示於網頁路徑)</span></label
            >
            <input
              v-model="form.slug"
              type="text"
              placeholder="輸入文章 ID"
              class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>
        </div>

        <!-- Cover Image -->
        <div class="flex justify-center items-start gap-4">
          <div class="w-1/4">
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase"
              >封面圖片<span class="text-[10px] normal-case text-neutral-600">(16:9)</span></label
            >
            <backend-cover-image-cropper v-model="form.coverImage" :slug="form.slug || article?.slug || 'article'" />
          </div>
          <!-- Excerpt -->
          <div class="w-3/4">
            <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">文章摘要</label>
            <textarea
              v-model="form.excerpt"
              rows="5"
              placeholder="簡短描述文章內容（在文章列表中顯示）"
              class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors resize-none leading-6"
            />
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">文章內容</label>
          <backend-rich-editor v-model="form.content" />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            class="px-6 py-2.5 text-sm font-medium rounded-lg transition-all"
            :class="saved ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-900 hover:bg-white'"
            :disabled="saving"
          >
            <span v-if="saving">儲存中…</span>
            <span v-else-if="saved">✓ 已儲存</span>
            <span v-else>儲存變更</span>
          </button>
          <NuxtLink
            to="/backend/articles"
            class="px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >取消</NuxtLink
          >
          <NuxtLink
            v-if="article"
            :to="`/articles/${article.slug}`"
            target="_blank"
            class="ml-auto text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            在前台查看 →
          </NuxtLink>
        </div>
      </form>
    </div>
    <div class="w-full lg:w-1/3">
      <!-- Comments section -->
      <div class="mt-4 lg:mt-15">
        <div class="flex lg:hidden items-center gap-3 mb-5">
          <div class="flex-1 h-px bg-neutral-800" />
          <h2 class="text-xs tracking-widest uppercase text-neutral-500">留言管理</h2>
          <div class="flex-1 h-px bg-neutral-800" />
        </div>

        <!-- Summary -->
        <div class="flex items-center gap-3 mb-2 text-xs text-neutral-400">
          <span>共 {{ comments.length }} 則留言</span>
          <span class="text-neutral-700">·</span>
          <span class="text-emerald-500">{{ visibleCount }} 則顯示中</span>
          <span class="text-neutral-700">·</span>
          <span class="text-neutral-600">{{ comments.length - visibleCount }} 則已隱藏</span>
        </div>

        <!-- Loading -->
        <div v-if="commentsLoading" class="py-10 text-center text-neutral-600 text-sm">載入留言中…</div>

        <!-- Empty -->
        <div v-else-if="comments.length === 0" class="py-10 text-center text-neutral-700 text-sm">尚無留言</div>

        <!-- Comment list -->
        <div v-else class="space-y-3">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="rounded-lg border px-3 md:px-4 py-3 transition-colors"
            :class="comment.visible ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/40'"
          >
            <div class="flex flex-row lg:flex-col items-start gap-3">
              <!-- Content -->
              <div class="w-full flex-1">
                <div class="flex lg:justify-between items-center gap-2 flex-wrap mb-1.5">
                  <!-- Visible indicator dot -->
                  <div class="flex justify-center items-center gap-2">
                    <span
                      class="block w-2 h-2 rounded-full"
                      :class="comment.visible ? 'bg-emerald-500' : 'bg-neutral-600'"
                    />
                    <span class="text-sm font-medium text-white">{{ comment.name }}</span>
                  </div>

                  <time class="text-[11px] text-neutral-600">
                    {{
                      new Date(comment.createdAt).toLocaleString('zh-TW', { dateStyle: 'short', timeStyle: 'short' })
                    }}
                  </time>
                  <span
                    class="lg:hidden ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                    :class="comment.visible ? 'bg-emerald-900/40 text-emerald-500' : 'bg-neutral-800 text-neutral-500'"
                  >
                    {{ comment.visible ? '顯示中' : '已隱藏' }}
                  </span>
                </div>
                <p class="text-xs text-neutral-400 whitespace-pre-wrap wrap-break-word">
                  {{ comment.content }}
                </p>
              </div>

              <!-- Actions -->
              <div class="lg:w-full shrink-0 flex justify-between items-center gap-1.5">
                <div class="shrink-0 flex flex-col md:flex-row items-center gap-1.5">
                  <button
                    type="button"
                    class="px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs rounded-md border transition-all"
                    :disabled="togglingId === comment.id"
                    :class="
                      comment.visible
                        ? 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
                        : 'border-emerald-800 text-emerald-500 hover:border-emerald-600 hover:bg-emerald-900/20'
                    "
                    @click="handleToggle(comment)"
                  >
                    <span v-if="togglingId === comment.id">…</span>
                    <span v-else>{{ comment.visible ? '隱藏' : '顯示' }}</span>
                  </button>
                  <button
                    type="button"
                    class="px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs rounded-md border border-neutral-800 text-neutral-600 hover:border-rose-800 hover:text-rose-500 transition-all"
                    :disabled="deletingId === comment.id"
                    @click="handleDelete(comment)"
                  >
                    <span v-if="deletingId === comment.id">…</span>
                    <span v-else>刪除</span>
                  </button>
                </div>
                <span
                  class="hidden lg:block ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                  :class="comment.visible ? 'bg-emerald-900/40 text-emerald-500' : 'bg-neutral-800 text-neutral-500'"
                >
                  {{ comment.visible ? '顯示中' : '已隱藏' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
