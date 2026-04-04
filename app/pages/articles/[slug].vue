<script setup lang="ts">
const route = useRoute()

const articles: Record<string, {
  title: string; date: string; tags: string[]
  readTime: string; content: string
}> = {
  'morning-rituals': {
    title: '清晨的儀式感',
    date: '2026-03-20',
    tags: ['生活', '日常'],
    readTime: '3 分鐘',
    content: `
每天清晨，我都會給自己留出一段靜謐的時光。

泡一杯熱茶，翻開日記，讓思緒在文字間慢慢甦醒。這個習慣從大學時期就開始了，那時候宿舍裡總是吵鬧，只有早晨六點前才是屬於自己的安靜。

後來慢慢地，這個「不得不」的習慣，變成了一種選擇。

我開始相信，一天的品質，很大程度上取決於早晨如何開始。不是說要做什麼驚天動地的事，只是——給自己一個喘息的空間，在世界的喧囂開始之前，先和自己好好說說話。

有時候日記裡只有幾行字，「今天天氣很好，陽光從窗縫照進來」，就這樣，也足夠了。

儀式感不需要複雜，它只是一個提醒：你在好好生活。
    `,
  },
  'reading-notes-2025': {
    title: '2025 年閱讀回顧',
    date: '2026-01-01',
    tags: ['閱讀', '書單'],
    readTime: '6 分鐘',
    content: `
這一年讀了三十二本書。

說起來有點不可思議，因為年初的我幾乎已經和閱讀漸行漸遠了。手機把碎片時間切割得乾乾淨淨，等到想靜下來看書，腦袋已經習慣了快速切換的節奏，一頁都讀不進去。

改變發生在三月。

那天我把手機放在客廳，帶著一本書躲進臥室，就那麼讀了兩個小時。讀完後有一種奇異的滿足感，像是久旱後終於下了一場雨。

從那之後，我給自己定了一個小規則：睡前三十分鐘，只讀書，不碰手機。

今年印象最深的三本：

**《挪威的森林》**——重讀了一次，這次讀出了不一樣的感受。也許是年紀到了，對那種無法言說的悲傷，突然就懂了。

**《被討厭的勇氣》**——讀這本書的時候，很多次要停下來想一想。阿德勒的哲學有些地方和我原本的想法衝突，但衝突本身就是思考的起點。

**《82年生的金智英》**——不需要多說什麼，讀的時候我哭了好幾次。

2026 年，繼續讀下去。
    `,
  },
}

const slug = route.params.slug as string
const article = articles[slug]

if (!article) {
  navigateTo('/articles', { replace: true })
}

useHead({ title: article ? `${article.title} — Sam's World` : 'Sam\'s World' })

const formattedContent = computed(() =>
  article?.content
    .trim()
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean) ?? []
)
</script>

<template>
  <div v-if="article" class="min-h-full">

    <!-- Header canvas -->
    <div class="relative h-56 overflow-hidden bg-petal-50">
      <canvas-sparkles class="absolute inset-0" />
      <canvas-wave-canvas class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-10 pb-8">
        <div class="max-w-xl">
          <div class="flex gap-2 mb-3">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="text-xs bg-white/60 text-petal-500 px-3 py-0.5 rounded-full border border-petal-100"
            >{{ tag }}</span>
          </div>
          <h1 class="font-display text-3xl text-mauve-800 leading-tight">{{ article.title }}</h1>
          <div class="flex items-center gap-3 mt-2 text-xs text-mauve-400">
            <span>{{ article.date }}</span>
            <span class="text-petal-200">·</span>
            <span>{{ article.readTime }}閱讀</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back link -->
    <div class="px-10 pt-6">
      <NuxtLink
        to="/articles"
        class="inline-flex items-center gap-1.5 text-xs text-mauve-400 hover:text-petal-500 transition-colors"
      >
        <span>←</span> 返回文章列表
      </NuxtLink>
    </div>

    <!-- Article content -->
    <article class="px-10 py-8 max-w-xl">
      <div class="space-y-5 text-mauve-700 leading-8 text-[15px]">
        <template v-for="(para, i) in formattedContent" :key="i">
          <!-- Bold headings -->
          <h2 v-if="para.startsWith('**') && para.endsWith('**')" class="font-display text-xl text-mauve-800 pt-2">
            {{ para.slice(2, -2) }}
          </h2>
          <p v-else>{{ para }}</p>
        </template>
      </div>

      <!-- End decoration -->
      <div class="flex items-center gap-4 mt-12 mb-2">
        <div class="flex-1 h-px bg-petal-100" />
        <span class="text-petal-300 text-xs">✦</span>
        <div class="flex-1 h-px bg-petal-100" />
      </div>
      <p class="text-center text-xs text-mauve-300 tracking-widest">感謝閱讀</p>
    </article>

  </div>
</template>
