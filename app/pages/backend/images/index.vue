<script setup lang="ts">
  import { useImageApi } from '@/composables/api/useImageApi'
  import type { ImageFile } from '@/types'

  definePageMeta({ layout: 'backend' })
  useHead({ title: '圖檔管理 — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

  const { getImages, deleteImage } = useImageApi()

  const isLoading = ref(false)
  const images = ref<ImageFile[]>([])
  const viewMode = ref<'grid' | 'list'>('grid')
  const showUnusedOnly = ref(false)
  const deleteTarget = ref<ImageFile | null>(null)
  const isDeleting = ref(false)

  const fetchImages = async () => {
    isLoading.value = true
    try {
      const res = await getImages()
      images.value = res.data || []
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => fetchImages())

  const filtered = computed(() =>
    showUnusedOnly.value ? images.value.filter((img) => img.usedIn.length === 0) : images.value
  )

  const unusedCount = computed(() => images.value.filter((img) => img.usedIn.length === 0).length)

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function formatDate(iso: string): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  function filename(key: string): string {
    return key.split('/').pop() ?? key
  }

  function folder(key: string): string {
    const parts = key.split('/')
    return parts.length > 1 ? parts[0] : '—'
  }

  const usageTypeLabel: Record<string, string> = {
    cover: '封面圖',
    inline: '內文圖',
    avatar: '頭像'
  }

  async function doDelete() {
    if (!deleteTarget.value) return
    isDeleting.value = true
    try {
      await deleteImage(deleteTarget.value.key)
      images.value = images.value.filter((img) => img.key !== deleteTarget.value!.key)
      deleteTarget.value = null
    } catch (error) {
      console.error('Error deleting image:', error)
    } finally {
      isDeleting.value = false
    }
  }
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-xl font-semibold text-white mb-1">圖檔管理</h1>
        <div v-if="isLoading" class="h-4 bg-neutral-700 rounded-full w-32 mt-1 animate-pulse" />
        <p v-else class="text-sm text-neutral-500">
          共 {{ images.length }} 張圖片
          <span v-if="unusedCount > 0" class="text-amber-400 ml-1">· {{ unusedCount }} 張未使用</span>
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-4">
        <!-- Unused filter toggle -->
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <span class="text-xs text-neutral-500">只顯示未使用</span>
          <div
            class="relative w-8 h-4 rounded-full transition-colors"
            :class="showUnusedOnly ? 'bg-amber-500' : 'bg-neutral-700'"
            @click="showUnusedOnly = !showUnusedOnly"
          >
            <span
              class="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200"
              :style="showUnusedOnly ? 'left: 1.125rem' : 'left: 0.125rem'"
            />
          </div>
        </label>

        <!-- View mode toggle -->
        <div class="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-lg p-1">
          <button
            class="px-2.5 py-1 rounded-md text-xs transition-colors"
            :class="viewMode === 'grid' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'"
            @click="viewMode = 'grid'"
          >
            ⊞ 方格
          </button>
          <button
            class="px-2.5 py-1 rounded-md text-xs transition-colors"
            :class="viewMode === 'list' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'"
            @click="viewMode = 'list'"
          >
            ☰ 清單
          </button>
        </div>
      </div>
    </div>

    <!-- Grid view -->
    <div v-if="viewMode === 'grid'">
      <!-- Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
        <div v-for="i in 10" :key="i" class="bg-neutral-800/40 border border-neutral-700 rounded-xl overflow-hidden">
          <div class="aspect-video bg-neutral-700" />
          <div class="p-3">
            <div class="h-3 bg-neutral-700 rounded-full w-3/4 mb-2" />
            <div class="h-3 bg-neutral-700/60 rounded-full w-1/2" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filtered.length === 0"
        class="py-16 text-center text-sm text-neutral-600 border border-dashed border-neutral-800 rounded-xl"
      >
        {{ showUnusedOnly ? '沒有未使用的圖片' : '尚無圖片' }}
      </div>

      <!-- Cards -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="img in filtered"
          :key="img.key"
          class="bg-neutral-800/40 border border-neutral-700 rounded-xl overflow-hidden group"
          :class="img.usedIn.length === 0 ? 'border-amber-800/40' : ''"
        >
          <!-- Thumbnail -->
          <div class="aspect-video bg-neutral-900 overflow-hidden">
            <img
              :src="img.url"
              :alt="filename(img.key)"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <!-- Info -->
          <div class="p-3">
            <p class="text-xs text-neutral-300 truncate font-medium mb-0.5" :title="filename(img.key)">
              {{ filename(img.key) }}
            </p>
            <p class="text-[10px] text-neutral-600 mb-2">
              {{ folder(img.key) }} · {{ formatSize(img.size) }}
            </p>

            <!-- Usage badges -->
            <div v-if="img.usedIn.length > 0" class="flex flex-wrap gap-1 mb-2">
              <span
                v-for="(use, i) in img.usedIn"
                :key="i"
                class="text-[10px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 rounded truncate max-w-full"
                :title="use.title"
              >
                {{ usageTypeLabel[use.type] }}｜{{ use.title }}
              </span>
            </div>
            <div v-else class="mb-2">
              <span class="text-[10px] px-1.5 py-0.5 bg-amber-900/40 text-amber-400 rounded">未使用</span>
            </div>

            <!-- Delete button (unused only) -->
            <button
              v-if="img.usedIn.length === 0"
              class="w-full text-[10px] text-neutral-600 hover:text-rose-400 border border-neutral-700 hover:border-rose-800 rounded-md py-1 transition-colors"
              @click="deleteTarget = img"
            >
              移除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div v-else>
      <div class="bg-neutral-800/40 border border-neutral-700 rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-700 text-left">
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">圖片</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">檔案名稱</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">資料夾</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">大小</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">日期</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase">使用狀況</th>
              <th class="px-5 py-3 text-xs text-neutral-500 font-normal tracking-widest uppercase w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton -->
            <template v-if="isLoading">
              <tr
                v-for="i in 8"
                :key="i"
                class="border-b border-neutral-700/50 last:border-0 animate-pulse"
              >
                <td class="px-5 py-3">
                  <div class="w-14 h-10 bg-neutral-700 rounded-md" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 bg-neutral-700 rounded-full w-36" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 bg-neutral-700/60 rounded-full w-16" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 bg-neutral-700/60 rounded-full w-12" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 bg-neutral-700/40 rounded-full w-20" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-4 bg-neutral-700/40 rounded w-20" />
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 bg-neutral-700/30 rounded-full w-8" />
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="filtered.length === 0">
                <td colspan="7" class="px-5 py-12 text-center text-sm text-neutral-600">
                  {{ showUnusedOnly ? '沒有未使用的圖片' : '尚無圖片' }}
                </td>
              </tr>
              <tr
                v-for="img in filtered"
                :key="img.key"
                class="border-b border-neutral-700/50 last:border-0 hover:bg-neutral-700/20 transition-colors"
              >
                <!-- Thumbnail -->
                <td class="px-5 py-3">
                  <div class="w-14 h-10 bg-neutral-900 rounded-md overflow-hidden shrink-0">
                    <img
                      :src="img.url"
                      :alt="filename(img.key)"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </td>
                <!-- Filename -->
                <td class="px-5 py-3 max-w-xs">
                  <p class="text-sm text-neutral-200 truncate" :title="img.key">{{ filename(img.key) }}</p>
                </td>
                <!-- Folder -->
                <td class="px-5 py-3 text-xs text-neutral-500">{{ folder(img.key) }}</td>
                <!-- Size -->
                <td class="px-5 py-3 text-xs text-neutral-500 whitespace-nowrap">{{ formatSize(img.size) }}</td>
                <!-- Date -->
                <td class="px-5 py-3 text-xs text-neutral-600 whitespace-nowrap">{{ formatDate(img.lastModified) }}</td>
                <!-- Usage -->
                <td class="px-5 py-3">
                  <div v-if="img.usedIn.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="(use, i) in img.usedIn"
                      :key="i"
                      class="text-[10px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 rounded whitespace-nowrap"
                      :title="use.title"
                    >
                      {{ usageTypeLabel[use.type] }}｜{{ use.title }}
                    </span>
                  </div>
                  <span v-else class="text-[10px] px-1.5 py-0.5 bg-amber-900/40 text-amber-400 rounded">未使用</span>
                </td>
                <!-- Action -->
                <td class="px-5 py-3">
                  <button
                    v-if="img.usedIn.length === 0"
                    class="text-xs text-neutral-600 hover:text-rose-400 transition-colors"
                    @click="deleteTarget = img"
                  >
                    移除
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          @click.self="deleteTarget = null"
        >
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6 w-96 shadow-xl">
            <h3 class="text-sm font-medium text-white mb-2">確認移除</h3>
            <p class="text-xs text-neutral-400 mb-3 leading-5">
              確定要從 Cloudflare R2 移除以下圖片嗎？此動作無法復原。
            </p>
            <!-- Preview -->
            <div class="rounded-lg overflow-hidden bg-neutral-900 mb-5 aspect-video">
              <img
                :src="deleteTarget.url"
                :alt="filename(deleteTarget.key)"
                class="w-full h-full object-contain"
              />
            </div>
            <p class="text-[11px] text-neutral-500 mb-5 truncate font-mono">{{ deleteTarget.key }}</p>
            <div class="flex gap-3 justify-end">
              <button
                class="px-4 py-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-600 rounded-lg transition-colors"
                @click="deleteTarget = null"
              >
                取消
              </button>
              <button
                class="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors disabled:opacity-50"
                :disabled="isDeleting"
                @click="doDelete"
              >
                {{ isDeleting ? '移除中…' : '確認移除' }}
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
