<script setup lang="ts">
  useHead({ title: "關於作者 — Sam's World" })

  const infoCards = [
    { label: 'Location', value: '臺灣 · 台北' },
    { label: 'Occupation', value: '文字愛好者' },
    { label: 'Reading', value: '每年 30+ 本書' },
    { label: 'Favorite Season', value: '秋天' }
  ]

  const interests = ['閱讀', '手寫日記', '輕音樂', '散步', '咖啡館', '電影', '文具', '植物', '燭光', '老歌']
</script>

<template>
  <div class="min-h-full">
    <!-- Hero canvas section -->
    <div class="relative h-72 overflow-hidden bg-petal-50">
      <canvas-wave-canvas class="absolute inset-0" />
      <canvas-sparkles class="absolute inset-0" />

      <!-- Decorative rings -->
      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-petal-200/40 pointer-events-none" />
      <div class="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-petal-300/30 pointer-events-none" />

      <div class="absolute inset-0 flex items-end px-10 pb-10">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-2">About</p>
          <h1 class="font-display text-4xl text-mauve-800 leading-tight">Hello, I'm Sam</h1>
          <p class="text-mauve-400 mt-1 text-sm">一個喜歡閱讀、紀錄與慢慢生活的女孩</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-10 py-12">
      <div class="space-y-6 text-mauve-700 leading-8 text-[15px]">
        <p>
          歡迎來到我的小小天地。這裡是我用來記錄日常感悟、閱讀筆記與生活碎片的地方，
          沒有特定主題，只有真實的文字與柔軟的心情。
        </p>
        <p>我喜歡在清晨喝一杯熱茶，讓文字慢慢地流淌；也喜歡在深夜翻開一本好書， 沉浸在別人的故事裡，忘記時間的流逝。</p>
        <p>
          這個部落格是我的私人角落，也是我與世界溝通的橋樑。如果你也喜歡文字與閱讀，
          希望這裡能成為你偶爾停下腳步、喘口氣的地方。
        </p>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-10">
        <div class="flex-1 h-px bg-petal-200" />
        <span class="text-petal-300 text-xs tracking-widest">✦ ✦ ✦</span>
        <div class="flex-1 h-px bg-petal-200" />
      </div>

      <!-- Info cards -->
      <div class="grid grid-cols-2 gap-4">
        <div v-for="card in infoCards" :key="card.label" class="p-5 rounded-2xl bg-petal-50 border border-petal-100">
          <p class="text-xs text-petal-400 tracking-widest mb-1">{{ card.label }}</p>
          <p class="text-mauve-700 text-sm font-medium">{{ card.value }}</p>
        </div>
      </div>

      <!-- Interests -->
      <div class="mt-10">
        <h2 class="font-display text-xl text-mauve-700 mb-5">喜歡的事</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in interests"
            :key="tag"
            class="px-4 py-1.5 rounded-full bg-petal-100 text-mauve-600 text-xs tracking-wide border border-petal-200"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
