<script setup lang="ts">
  import { useAboutApi } from '@/composables/api/useAboutApi'
  import type { AboutData } from '@/types'
  const { getAbout, saveAbout } = useAboutApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: '關於作者編輯 — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

  const isLoading = ref(false)

  const data = ref<AboutData | null>(null)
  const interestsInput = ref('')

  const fetchAbout = async () => {
    isLoading.value = true
    try {
      const res: any = await getAbout()
      data.value = res
      interestsInput.value = data.value?.interests.join(', ') ?? ''
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      isLoading.value = false
    }
  }

  fetchAbout()

  const saving = ref(false)
  const saved = ref(false)
  const newCardLabel = ref('')
  const newCardValue = ref('')

  function addCard() {
    if (!data.value || !newCardLabel.value.trim()) return
    data.value.infoCards.push({ label: newCardLabel.value.trim(), value: newCardValue.value.trim() })
    newCardLabel.value = ''
    newCardValue.value = ''
  }

  function removeCard(idx: number) {
    data.value?.infoCards.splice(idx, 1)
  }

  const doSave = async () => {
    if (!data.value) return
    saving.value = true
    await new Promise((r) => setTimeout(r, 250))
    // Parse interests
    data.value.interests = interestsInput.value
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    await saveAbout(data.value)
    saving.value = false
    saved.value = true
  }
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-semibold text-white mb-1">關於作者</h1>
        <p class="text-sm text-neutral-500">編輯關於頁面的文字內容</p>
      </div>
      <a href="/about" target="_blank" class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >在前台查看 →</a
      >
    </div>

    <div v-if="data" class="space-y-8">
      <!-- Name -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">名稱</label>
        <input
          v-model="data.name"
          type="text"
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <!-- Message ZH -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">自我介紹（中文）</label>
        <textarea
          v-model="data.message"
          rows="5"
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors resize-none leading-7"
        />
      </div>

      <!-- Message EN -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">自我介紹（英文）</label>
        <textarea
          v-model="data.messageEn"
          rows="5"
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors resize-none leading-7"
        />
      </div>

      <!-- Info cards -->
      <div>
        <label class="block text-xs text-neutral-400 mb-4 tracking-widest uppercase">資訊卡片</label>
        <div class="space-y-3">
          <div
            v-for="(card, idx) in data.infoCards"
            :key="idx"
            class="flex gap-3 items-start bg-neutral-800/40 border border-neutral-700 rounded-lg p-4"
          >
            <div class="flex-1 grid grid-cols-3 gap-3">
              <input
                v-model="card.label"
                type="text"
                placeholder="Label"
                class="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-xs focus:outline-none focus:border-neutral-500"
              />
              <input
                v-model="card.value"
                type="text"
                placeholder="內容"
                class="col-span-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-xs focus:outline-none focus:border-neutral-500"
              />
            </div>
            <button
              type="button"
              class="text-neutral-600 hover:text-rose-400 transition-colors text-sm pt-2"
              @click="removeCard(idx)"
            >
              ✕
            </button>
          </div>

          <!-- Add card -->
          <div class="flex gap-3 items-start border border-dashed border-neutral-700 rounded-lg p-4">
            <div class="flex-1 grid grid-cols-3 gap-3">
              <input
                v-model="newCardLabel"
                type="text"
                placeholder="Label (e.g. Hobby)"
                class="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-xs focus:outline-none focus:border-neutral-500 placeholder-neutral-600"
              />
              <input
                v-model="newCardValue"
                type="text"
                placeholder="內容"
                class="col-span-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-xs focus:outline-none focus:border-neutral-500 placeholder-neutral-600"
                @keyup.enter="addCard"
              />
            </div>
            <button
              type="button"
              class="text-neutral-500 hover:text-white transition-colors text-sm pt-2 px-1"
              @click="addCard"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div>
        <label class="block text-xs text-neutral-400 mb-2 tracking-widest uppercase">
          興趣標籤 <span class="normal-case text-neutral-600">（逗號或空白分隔）</span>
        </label>
        <input
          v-model="interestsInput"
          type="text"
          placeholder="閱讀, 手寫日記, 輕音樂, 散步..."
          class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
        />
        <!-- Preview -->
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="tag in interestsInput
              .split(/[,，\s]+/)
              .map((t) => t.trim())
              .filter(Boolean)"
            :key="tag"
            class="px-2 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Save -->
      <div class="pt-2">
        <button
          type="button"
          class="px-6 py-2.5 text-sm font-medium rounded-lg transition-all"
          :class="saved ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-900 hover:bg-white'"
          :disabled="saving"
          @click="doSave"
        >
          <span v-if="saving">儲存中…</span>
          <span v-else-if="saved">✓ 已儲存</span>
          <span v-else>儲存變更</span>
        </button>
        <p class="text-xs text-neutral-600 mt-2">
          上次更新：{{ data.updatedAt ? new Date(data.updatedAt).toLocaleString('zh-TW') : '—' }}
        </p>
      </div>
    </div>
  </div>
</template>
