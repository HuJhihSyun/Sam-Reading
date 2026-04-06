<script setup lang="ts">
  useHead({ title: "全部文章 — Sam's World" })

  const articles = [
    {
      slug: 'morning-rituals',
      title: '清晨的儀式感',
      date: '2026-03-20',
      tags: ['生活', '日常'],
      excerpt: '每天清晨，我都會給自己留出一段靜謐的時光。泡一杯熱茶，翻開日記，讓思緒在文字間慢慢甦醒。'
    },
    {
      slug: 'reading-notes-2025',
      title: '2025 年閱讀回顧',
      date: '2026-01-01',
      tags: ['閱讀', '書單'],
      excerpt: '這一年讀了三十二本書，有些讓我落淚，有些讓我重新思考生活的方式，每一本都留下了痕跡。'
    },
    {
      slug: 'autumn-walks',
      title: '秋天的散步記事',
      date: '2025-11-08',
      tags: ['散步', '秋天', '日常'],
      excerpt: '葉子開始變色的時候，我喜歡帶上耳機，漫無目的地走上一個小時，讓腦袋徹底放空。'
    },
    {
      slug: 'small-pleasures',
      title: '微小而確實的幸福',
      date: '2025-09-15',
      tags: ['生活', '感悟'],
      excerpt: '新買的筆記本第一頁、剛沖好的咖啡、窗外突然放晴的天空——幸福原來這麼輕，輕到幾乎不需要理由。'
    },
    {
      slug: 'letter-to-self',
      title: '給二十五歲的自己',
      date: '2025-07-03',
      tags: ['感悟', '成長'],
      excerpt: '不必那麼著急，所有的答案都會在恰當的時候出現。你現在所經歷的每一段迷茫，都是你正在成長的證明。'
    },
    {
      slug: 'favorite-cafes',
      title: '那些讓我流連忘返的咖啡館',
      date: '2025-05-20',
      tags: ['咖啡館', '生活'],
      excerpt: '有些咖啡館不只是喝咖啡的地方，它是一個讓你暫時從世界抽身、好好與自己相處的空間。'
    }
  ]

  const selectedTag = ref('')
  const allTags = [...new Set(articles.flatMap((a) => a.tags))]

  const filtered = computed(() =>
    selectedTag.value ? articles.filter((a) => a.tags.includes(selectedTag.value)) : articles
  )
</script>

<template>
  <div class="min-h-full">
    <!-- Header canvas -->
    <div class="relative h-48 overflow-hidden bg-petal-50">
      <canvas-wave-canvas class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-10 pb-8">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-1">Articles</p>
          <h1 class="font-display text-3xl text-mauve-800">全部文章</h1>
        </div>
      </div>
    </div>

    <!-- Filter tags -->
    <div class="px-10 pt-8 pb-4">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-xs text-mauve-400 mr-1 tracking-wide">篩選：</span>
        <button
          class="px-3 py-1 rounded-full text-xs border transition-all"
          :class="
            selectedTag === ''
              ? 'bg-petal-400 text-white border-petal-400'
              : 'border-petal-200 text-mauve-500 hover:border-petal-300'
          "
          @click="selectedTag = ''"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="px-3 py-1 rounded-full text-xs border transition-all"
          :class="
            selectedTag === tag
              ? 'bg-petal-400 text-white border-petal-400'
              : 'border-petal-200 text-mauve-500 hover:border-petal-300'
          "
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Article list -->
    <div class="px-10 pb-12">
      <TransitionGroup name="list" tag="div" class="space-y-4 mt-4">
        <NuxtLink
          v-for="article in filtered"
          :key="article.slug"
          :to="`/articles/${article.slug}`"
          class="block p-6 rounded-2xl border border-petal-100 bg-white hover:border-petal-200 hover:shadow-sm hover:shadow-petal-100 transition-all duration-200 group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="font-display text-lg text-mauve-800 group-hover:text-mauve-700 mb-2 leading-snug">
                {{ article.title }}
              </h2>
              <p class="text-sm text-mauve-500 leading-6 line-clamp-2">{{ article.excerpt }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-xs text-mauve-300">{{ article.date }}</span>
                <span class="text-petal-200">·</span>
                <div class="flex gap-1.5">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="text-xs text-petal-500 bg-petal-50 px-2 py-0.5 rounded-full"
                    >{{ tag }}</span
                  >
                </div>
              </div>
            </div>
            <span class="text-petal-300 group-hover:text-petal-400 transition-colors mt-1 shrink-0">→</span>
          </div>
        </NuxtLink>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(6px);
  }
</style>
