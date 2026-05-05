<script setup lang="ts">
  import { useBlogConfig } from '@/composables/useBlogConfig'
  import { useContactApi } from '@/composables/api/useContactApi'
  const { postContact } = useContactApi()
  const { buildPageTitle } = useBlogConfig()

  const pageTitle = buildPageTitle('聯絡作者')
  const pageDescription = '想和 Samantha 分享閱讀心得或生活感悟？歡迎透過表單留下你的話，她會認真閱讀每一封訊息。'

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

  const form = reactive({ name: '', email: '', message: '' })
  const sent = ref(false)
  const submitting = ref(false)

  const handleSubmit = async () => {
    submitting.value = true
    try {
      await postContact(form)
      sent.value = true
    } catch (error) {
      console.error('Error submitting contact form:', error)
    } finally {
      submitting.value = false
    }
  }
  const resetForm = () => {
    sent.value = false
    Object.assign(form, { name: '', email: '', message: '' })
  }
</script>

<template>
  <div class="min-h-full">
    <!-- Header canvas -->
    <div class="relative h-48 overflow-hidden bg-petal-50">
      <canvas-wave-canvas class="absolute inset-0" />
      <canvas-floating-petals class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-5 md:px-10 pb-8">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-1">Contact</p>
          <h1 class="font-display text-3xl text-mauve-800">聯絡作者</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 md:px-10 py-12 max-w-lg">
      <Transition name="fade" mode="out-in">
        <!-- Success state -->
        <div v-if="sent" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-5 rounded-full bg-petal-100 flex items-center justify-center">
            <span class="text-2xl">✦</span>
          </div>
          <h2 class="font-display text-2xl text-mauve-700 mb-3">謝謝你的來信</h2>
          <p class="text-mauve-500 text-sm leading-7">
            我已經收到你的留言了。<br />
            我會盡快回覆，請耐心等候 ♡
          </p>
          <button
            class="mt-8 px-6 py-2.5 rounded-full border border-petal-200 text-mauve-500 text-sm hover:border-petal-300 transition-colors"
            @click="resetForm"
          >
            再寫一封
          </button>
        </div>

        <!-- Form -->
        <div v-else>
          <p class="text-mauve-500 text-sm leading-7 mb-8">
            無論是關於文章的想法、合作邀請，或者只是想打個招呼， 都歡迎留言給我。我很珍視每一封來信。
          </p>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-xs text-mauve-500 tracking-wide mb-1.5">姓名</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="你的名字"
                class="w-full px-4 py-3 rounded-xl border border-petal-200 bg-petal-50/50 text-mauve-700 text-sm placeholder:text-mauve-300 focus:outline-none focus:border-petal-300 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs text-mauve-500 tracking-wide mb-1.5">電子郵件</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="your@email.com"
                class="w-full px-4 py-3 rounded-xl border border-petal-200 bg-petal-50/50 text-mauve-700 text-sm placeholder:text-mauve-300 focus:outline-none focus:border-petal-300 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs text-mauve-500 tracking-wide mb-1.5">留言</label>
              <textarea
                v-model="form.message"
                required
                rows="5"
                placeholder="想對我說的話……"
                class="w-full px-4 py-3 rounded-xl border border-petal-200 bg-petal-50/50 text-mauve-700 text-sm placeholder:text-mauve-300 focus:outline-none focus:border-petal-300 focus:bg-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full py-3 rounded-xl bg-petal-400 text-white text-sm font-medium tracking-wide hover:bg-petal-500 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitting ? '傳送中…' : '送出留言' }}
            </button>
          </form>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
