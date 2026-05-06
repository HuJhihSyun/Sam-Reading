<script setup lang="ts">
  import { useContactApi } from '@/composables/api/useContactApi'
  import type { ContactMessage } from '@/types'
  const { getContact, putContact, deleteContact } = useContactApi()

  definePageMeta({ layout: 'backend' })
  useHead({ title: '聯絡訊息 — 後台管理' })
  useSeoMeta({ robots: 'noindex, nofollow' })

  const messages = ref<ContactMessage[]>([])
  const selected = ref<ContactMessage | null>(null)
  const filterUnread = ref(false)
  const deleteTarget = ref<ContactMessage | null>(null)

  const isLoading = ref(false)

  const fetchContact = async () => {
    isLoading.value = true
    try {
      const res: any = await getContact()
      messages.value = res.data
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      isLoading.value = false
    }
  }

  fetchContact()

  const filtered = computed(() => {
    let list = filterUnread.value ? messages.value.filter((m) => !m.read) : messages.value
    return list.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  })

  const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)

  function openMessage(msg: ContactMessage) {
    selected.value = msg
    if (!msg.read) {
      markRead(msg.id)
      const target = messages.value.find((m) => m.id === msg.id)
      if (target) target.read = true
    }
  }

  const markRead = (id: string): void => {
    const msg = messages.value.find((m) => m.id === id)
    if (msg) {
      msg.read = true
      putContact(msg, id)
    }
  }

  function confirmDelete(msg: ContactMessage) {
    deleteTarget.value = msg
  }

  function doDelete() {
    if (!deleteTarget.value) return
    deleteContact(deleteTarget.value.id)
    messages.value = messages.value.filter((m) => m.id !== deleteTarget.value!.id)
    if (selected.value?.id === deleteTarget.value.id) selected.value = null
    deleteTarget.value = null
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-semibold text-white mb-1">聯絡訊息</h1>
        <div v-if="isLoading" class="h-4 bg-neutral-700 rounded-full w-28 mt-1 animate-pulse" />
        <p v-else class="text-sm text-neutral-500">
          共 {{ messages.length }} 則訊息
          <span v-if="unreadCount > 0" class="text-rose-400 ml-1">· {{ unreadCount }} 則未讀</span>
        </p>
      </div>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <span class="text-xs text-neutral-500">只顯示未讀</span>
        <div
          class="relative w-8 h-4 rounded-full transition-colors"
          :class="filterUnread ? 'bg-rose-500' : 'bg-neutral-700'"
          @click="filterUnread = !filterUnread"
        >
          <span
            class="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200"
            :style="filterUnread ? 'left: 1.125rem' : 'left: 0.125rem'"
          />
        </div>
      </label>
    </div>

    <div class="grid grid-cols-5 gap-6">
      <!-- Message list -->
      <div class="col-span-2 space-y-2">
        <template v-if="isLoading">
          <div
            v-for="i in 3"
            :key="i"
            class="w-full p-4 rounded-xl border border-neutral-700 bg-neutral-800/40 animate-pulse"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="h-3.5 bg-neutral-700 rounded-full flex-1" />
              <div class="h-3 bg-neutral-700/60 rounded-full w-10 shrink-0" />
            </div>
            <div class="h-3 bg-neutral-700/60 rounded-full w-full mb-1.5" />
            <div class="h-3 bg-neutral-700/40 rounded-full w-4/5 mb-2" />
            <div class="h-2.5 bg-neutral-700/30 rounded-full w-1/2" />
          </div>
        </template>
        <template v-else>
          <div v-if="filtered.length === 0" class="py-10 text-center text-sm text-neutral-600">沒有訊息</div>
          <button
            v-for="msg in filtered"
            :key="msg.id"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="
              selected?.id === msg.id
                ? 'bg-neutral-700/60 border-neutral-600'
                : 'bg-neutral-800/40 border-neutral-700 hover:border-neutral-600'
            "
            @click="openMessage(msg)"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span v-if="!msg.read" class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span class="text-sm font-medium text-neutral-200 flex-1 truncate">{{ msg.name }}</span>
              <span class="text-xs text-neutral-600 shrink-0">
                {{ new Date(msg.receivedAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
            <p class="text-xs text-neutral-500 line-clamp-2 leading-5">{{ msg.message }}</p>
            <p class="text-[10px] text-neutral-700 mt-1">{{ msg.email }}</p>
          </button>
        </template>
      </div>

      <!-- Message detail -->
      <div class="col-span-3">
        <div
          v-if="!selected"
          class="h-full flex items-center justify-center text-sm text-neutral-700 bg-neutral-800/20 border border-dashed border-neutral-800 rounded-xl"
          style="min-height: 320px"
        >
          選擇一則訊息查看詳情
        </div>

        <div v-else class="bg-neutral-800/40 border border-neutral-700 rounded-xl p-6">
          <div class="flex items-start justify-between mb-5">
            <div>
              <h2 class="text-base font-medium text-white">{{ selected.name }}</h2>
              <a
                :href="`mailto:${selected.email}`"
                class="text-xs text-neutral-500 hover:text-petal-400 transition-colors mt-0.5 block"
              >
                {{ selected.email }}
              </a>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-neutral-600">{{ formatDate(selected.receivedAt) }}</span>
              <button
                class="text-xs text-neutral-600 hover:text-rose-400 transition-colors"
                @click="confirmDelete(selected)"
              >
                刪除
              </button>
            </div>
          </div>

          <div class="text-sm text-neutral-300 leading-7 bg-neutral-900/40 rounded-lg p-4 border border-neutral-700/50">
            {{ selected.message }}
          </div>

          <div class="mt-4 pt-4 border-t border-neutral-700/50">
            <a
              :href="`mailto:${selected.email}?subject=Re: 來自珊珊書評`"
              class="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              ✉ 回覆此訊息
            </a>
          </div>
        </div>
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
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6 w-80 shadow-xl">
            <h3 class="text-sm font-medium text-white mb-2">確認刪除</h3>
            <p class="text-xs text-neutral-400 mb-5 leading-5">確定要刪除來自「{{ deleteTarget.name }}」的訊息嗎？</p>
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
