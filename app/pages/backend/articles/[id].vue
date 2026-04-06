<script setup lang="ts">
  definePageMeta({ layout: 'backend' })

  import { useArticleData, type Article } from '@/composables/useArticleData'

  const route = useRoute()
  const { getById, update } = useArticleData()

  const article = ref<Article | null>(null)

  const form = reactive({
    title: '',
    publishDate: '',
    tags: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  })

  onMounted(() => {
    const id = route.params.id as string
    const found = getById(id)
    if (!found) {
      navigateTo('/backend/articles')
      return
    }
    article.value = found
    Object.assign(form, {
      title: found.title,
      publishDate: found.publishDate,
      tags: found.tags.join(', '),
      excerpt: found.excerpt,
      content: found.content,
      status: found.status
    })
  })

  useHead(computed(() => ({ title: article.value ? `編輯：${article.value.title} — 後台管理` : '編輯文章' })))

  const saving = ref(false)
  const saved = ref(false)
  const errors = reactive<Record<string, string>>({})

  function validate(): boolean {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.title.trim()) errors.title = '請填寫文章標題'
    if (!form.publishDate) errors.publishDate = '請選擇上架日期'
    return Object.keys(errors).length === 0
  }

  async function save() {
    if (!validate() || !article.value) return
    saving.value = true
    await new Promise(r => setTimeout(r, 300))
    const tags = form.tags.split(/[,，\s]+/).map(t => t.trim()).filter(Boolean)
    const updated = update(article.value.id, {
      title: form.title,
      publishDate: form.publishDate,
      tags,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status
    })
    if (updated) article.value = updated
    saving.value = false
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  }
</script>

<template>
  <div class="max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/backend/articles" class="text-neutral-500 hover:text-neutral-300 transition-colors text-sm">← 返回列表</NuxtLink>
      <h1 class="text-xl font-semibold text-white">編輯文章</h1>
      <span
        v-if="article"
        class="ml-2 text-[10px] px-2 py-0.5 rounded-full"
        :class="article.status === 'published' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'"
      >
        {{ article.status === 'published' ? '已發布' : '草稿' }}
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

      <!-- Tags -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">標籤 <span class="normal-case text-neutral-600">（用逗號或空白分隔）</span></label>
        <input
          v-model="form.tags"
          type="text"
          placeholder="生活, 閱讀, 日常"
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
        />
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
          <span v-else>儲存變更</span>
        </button>
        <NuxtLink to="/backend/articles" class="px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">取消</NuxtLink>
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
</template>
