<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  const { getArticle, createArticle } = useArticleApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: '新增文章 — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

  interface Article {
    id: string
    title: string
    slug: string
    publishDate: string
    tags: string[]
    excerpt: string
    content: string
    status: 'draft' | 'published'
    createdAt: string
    updatedAt: string
  }

  const form = reactive({
    title: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: '' as string,
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  })

  const saving = ref(false)
  const saved = ref(false)
  const errors = reactive<Record<string, string>>({})

  function validate(): boolean {
    Object.keys(errors).forEach((k) => delete errors[k])
    if (!form.title.trim()) errors.title = '請填寫文章標題'
    if (!form.publishDate) errors.publishDate = '請選擇上架日期'
    if (!form.slug.trim()) errors.slug = '請填寫文章 ID'
    return Object.keys(errors).length === 0
  }

  const save = async () => {
    if (!validate()) return
    saving.value = true
    const now = new Date().toISOString()
    const tags = form.tags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: form.title,
      publishDate: form.publishDate,
      tags,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      slug: form.slug,
      createdAt: now,
      updatedAt: now
    }
    console.log('Creating article with payload:', payload)
    await createArticle(payload)
    saving.value = false
    saved.value = true
    await navigateTo('/backend/articles')
  }
</script>

<template>
  <div class="max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/backend/articles" class="text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
        >← 返回列表</NuxtLink
      >
      <h1 class="text-xl font-semibold text-white">新增文章</h1>
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
          <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">發布狀態</label>
          <select
            v-model="form.status"
            class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
          >
            <option value="draft">草稿</option>
            <option value="published">發布</option>
          </select>
        </div>
      </div>

      <!-- Tags + Slug -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase"
            >標籤 <span class="normal-case text-neutral-600">（用逗號或空白分隔）</span></label
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
            >文章 ID <span class="normal-case text-neutral-600">（用於顯示於網頁路徑）</span></label
          >
          <input
            v-model="form.slug"
            type="text"
            placeholder="輸入文章 ID"
            class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
          />
        </div>
      </div>

      <!-- Excerpt -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">文章摘要</label>
        <textarea
          v-model="form.excerpt"
          rows="3"
          placeholder="簡短描述文章內容（在文章列表中顯示）"
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors resize-none leading-6"
        />
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
          <span v-else>儲存文章</span>
        </button>
        <NuxtLink
          to="/backend/articles"
          class="px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >取消</NuxtLink
        >
      </div>
    </form>
  </div>
</template>
