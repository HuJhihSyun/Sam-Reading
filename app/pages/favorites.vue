<script setup lang="ts">
  import { useSiteConfig } from '@/composables/useSiteConfig'
  const { buildPageTitle } = useSiteConfig()

  const pageTitle = buildPageTitle('喜歡的事物')
  const pageDescription = 'Samantha 的收藏清單：最愛的書、喜歡的音樂、生活中的小確幸，以及那些想去的地方。'

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

  const categories = [
    {
      title: '最愛的書',
      icon: '📖',
      color: 'bg-petal-50 border-petal-100',
      items: [
        { name: '挪威的森林', sub: '村上春樹' },
        { name: '被討厭的勇氣', sub: '岸見一郎 · 古賀史健' },
        { name: '82年生的金智英', sub: '趙南柱' },
        { name: '小王子', sub: '聖修伯里' },
        { name: '房思琪的初戀樂園', sub: '林奕含' }
      ]
    },
    {
      title: '喜歡的音樂',
      icon: '🎵',
      color: 'bg-mauve-50 border-mauve-100',
      items: [
        { name: '陳綺貞', sub: '時間的歌 · 旅行的意義' },
        { name: 'Norah Jones', sub: 'Come Away with Me' },
        { name: '王菲', sub: '旋木 · 我願意' },
        { name: 'Bon Iver', sub: 'Skinny Love' },
        { name: '李宗盛', sub: '山丘 · 給自己的歌' }
      ]
    },
    {
      title: '生活中的小確幸',
      icon: '✦',
      color: 'bg-petal-50 border-petal-100',
      items: [
        { name: '新筆記本的第一頁', sub: '' },
        { name: '剛沖好的咖啡香氣', sub: '' },
        { name: '下雨天在家的聲音', sub: '' },
        { name: '書店裡漫無目的地逛', sub: '' },
        { name: '突然收到舊朋友的訊息', sub: '' }
      ]
    },
    {
      title: '想去的地方',
      icon: '✈︎',
      color: 'bg-mauve-50 border-mauve-100',
      items: [
        { name: '京都', sub: '秋天的紅葉與枯山水' },
        { name: '巴黎', sub: '在塞納河邊看書' },
        { name: '冰島', sub: '追極光' },
        { name: '新疆', sub: '茫茫大地，無邊天空' },
        { name: '花蓮', sub: '台灣還有很多地方沒走' }
      ]
    }
  ]
</script>

<template>
  <div class="min-h-full">
    <!-- Header canvas -->
    <div class="relative h-48 overflow-hidden bg-petal-50">
      <canvas-sparkles class="absolute inset-0" />
      <canvas-wave-canvas class="absolute inset-0" />
      <div class="absolute inset-0 flex items-end px-5 md:px-10 pb-8">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-1">Favorites</p>
          <h1 class="font-display text-3xl text-mauve-800">喜歡的事物</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 md:px-10 py-10">
      <p class="text-mauve-400 text-sm mb-8 max-w-md leading-6">
        這裡收集了一些讓我感到喜悅的事物，沒有什麼特別的順序，只是想記錄下來。
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="cat in categories"
          :key="cat.title"
          class="rounded-2xl border p-6 transition-shadow hover:shadow-sm"
          :class="cat.color"
        >
          <div class="flex items-center gap-2 mb-4">
            <span class="text-base">{{ cat.icon }}</span>
            <h2 class="font-display text-base text-mauve-800">{{ cat.title }}</h2>
          </div>
          <ul class="space-y-2.5">
            <li v-for="item in cat.items" :key="item.name" class="flex items-baseline gap-2">
              <span class="text-petal-300 text-xs shrink-0">✦</span>
              <span class="text-mauve-700 text-sm">{{ item.name }}</span>
              <span v-if="item.sub" class="text-mauve-400 text-xs shrink-0">— {{ item.sub }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
