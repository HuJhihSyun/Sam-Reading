<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const isVisible = ref(false)
  const progress = ref(0)
  const currentMessage = ref('頁面整理中')

  const messages = ['頁面整理中', '翻閱文字中', '拾起花瓣中', '準備相遇中'] as const

  let progressTimer: ReturnType<typeof setInterval> | null = null
  let messageTimer: ReturnType<typeof setInterval> | null = null
  let finishTimer: ReturnType<typeof setTimeout> | null = null
  let loadingStartedAt = 0

  const minimumVisibleMs = 720
  const shouldShowLoading = (path: string) => !path.startsWith('/backend')
  const displayProgress = computed(() => Math.round(progress.value).toString().padStart(2, '0'))

  const clearTimers = () => {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }

    if (messageTimer) {
      clearInterval(messageTimer)
      messageTimer = null
    }

    if (finishTimer) {
      clearTimeout(finishTimer)
      finishTimer = null
    }
  }

  const startLoading = () => {
    if (finishTimer) {
      clearTimeout(finishTimer)
      finishTimer = null
    }

    loadingStartedAt = Date.now()
    isVisible.value = true
    progress.value = 0
    currentMessage.value = messages[0]

    if (!progressTimer) {
      progressTimer = setInterval(() => {
        if (progress.value >= 94) return

        const step = Math.max(1, Math.ceil(Math.random() * 9))
        progress.value = Math.min(94, progress.value + step)
      }, 85)
    }

    if (!messageTimer) {
      let messageIndex = 0
      messageTimer = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length
        currentMessage.value = messages[messageIndex]!
      }, 650)
    }
  }

  const finishLoading = () => {
    if (!isVisible.value) return

    const elapsed = Date.now() - loadingStartedAt
    const remaining = Math.max(0, minimumVisibleMs - elapsed)

    if (finishTimer) {
      clearTimeout(finishTimer)
    }

    finishTimer = setTimeout(() => {
      if (progressTimer) {
        clearInterval(progressTimer)
        progressTimer = null
      }

      if (messageTimer) {
        clearInterval(messageTimer)
        messageTimer = null
      }

      progress.value = 100
      currentMessage.value = '準備完成'

      finishTimer = setTimeout(() => {
        isVisible.value = false
        progress.value = 0
        currentMessage.value = messages[0]
        finishTimer = null
      }, 380)
    }, remaining)
  }

  if (typeof window !== 'undefined') {
    router.beforeEach((to, _from, next) => {
      if (shouldShowLoading(to.path)) {
        startLoading()
      } else {
        clearTimers()
        isVisible.value = false
      }
      next()
    })

    router.afterEach(() => {
      finishLoading()
    })

    router.onError(() => {
      finishLoading()
    })
  }

  onMounted(() => {
    startLoading()
    finishTimer = setTimeout(() => {
      finishLoading()
    }, 720)
  })

  onBeforeUnmount(() => {
    clearTimers()
  })
</script>

<template>
  <Teleport to="body">
    <Transition name="zen-loader">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-9999 overflow-hidden bg-linear-to-br from-petal-50 via-[#fffaf5] to-petal-100/95"
      >
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute -top-20 -left-10 w-56 h-56 rounded-full bg-petal-200/35 blur-3xl animate-[floatPetal_7s_ease-in-out_infinite]"
          />
          <div
            class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-rose-200/20 blur-3xl animate-[floatPetal_9s_ease-in-out_infinite]"
          />
          <div
            class="absolute inset-x-10 top-10 h-px bg-linear-to-r from-transparent via-petal-300/70 to-transparent"
          />
          <div
            class="absolute inset-x-10 bottom-10 h-px bg-linear-to-r from-transparent via-petal-300/70 to-transparent"
          />
        </div>

        <div class="relative flex h-full items-center justify-center px-6">
          <div class="w-full max-w-md">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] tracking-[0.5em] text-mauve-400 uppercase">Now Loading</p>
                <p class="mt-2 font-display text-4xl text-mauve-800 tabular-nums sm:text-5xl">
                  {{ displayProgress }}<span class="ml-1 text-xl text-mauve-400">%</span>
                </p>
                <p class="mt-2 text-[11px] tracking-[0.28em] text-mauve-500 uppercase">{{ currentMessage }}</p>
              </div>
            </div>

            <div class="mt-6 h-1 rounded-full bg-petal-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-linear-to-r from-petal-300 via-petal-300 to-mauve-300 transition-all duration-200 ease-out"
                :style="{ width: `${progress}%` }"
              />
            </div>

            <div class="mt-4 flex items-center justify-between text-[10px] tracking-[0.22em] text-mauve-400 uppercase">
              <span>頁面切換中</span>
              <span>Samantha Reading</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .zen-loader-enter-active {
    transition: opacity 0.1s ease;
  }

  .zen-loader-leave-active {
    transition: opacity 0.32s ease;
  }

  .zen-loader-enter-from,
  .zen-loader-leave-to {
    opacity: 0;
  }

  @keyframes floatPetal {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0, -12px, 0) scale(1.04);
    }
  }
</style>
