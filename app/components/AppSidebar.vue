<script setup lang="ts">
  import { markRaw } from 'vue'
  import PencilSvg from '@/assets/svg/pencil.svg?skipsvgo'
  import type { AboutData } from '@/types'

  const route = useRoute()

  const { data: about } = await useAsyncData('about-sidebar', () =>
    $fetch<AboutData>('/api/about')
  )

  const navItems = [
    { path: '/', label: '首頁', icon: markRaw(PencilSvg), text: 'Home' },
    { path: '/about', label: '關於作者', icon: markRaw(PencilSvg), text: 'About me' },
    { path: '/articles', label: '全部文章', icon: markRaw(PencilSvg), text: 'Articles' },
    { path: '/favorites', label: '喜歡的事物', icon: markRaw(PencilSvg), text: 'Favorites' },
    { path: '/contact', label: '聯絡作者', icon: markRaw(PencilSvg), text: 'Contact' }
  ]

  const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <div class="relative h-full flex flex-col overflow-hidden">
    <!-- Canvas background -->
    <!-- <canvas-floating-petals class="absolute inset-0 pointer-events-none" /> -->
    <canvas-paper-noise class="absolute inset-0 pointer-events-none" />

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-linear-to-b from-petal-50/80 via-petal-100/60 to-petal-100/80 pointer-events-none"
    />

    <span
      class="absolute bottom-0 right-0 text-transparent text-7xl opacity-70 font-extrabold font-display -z-10"
      style="-webkit-text-stroke: 1px #907862; writing-mode: vertical-rl; transform: rotate(180deg)"
    >
      Samantha<br />Reading
    </span>

    <!-- Content -->
    <div class="relative z-10 flex flex-col h-full px-5 py-8">
      <!-- Blog header -->
      <div class="text-center mb-10">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full overflow-hidden shadow-sm shadow-petal-200">
          <img
            v-if="about?.avatar"
            :src="about.avatar"
            alt="作者頭像"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-linear-to-br from-petal-200 to-petal-400 flex items-center justify-center"
          >
            <span class="font-display text-white text-xl font-semibold select-none">S</span>
          </div>
        </div>
        <h1 class="font-display text-mauve-800 text-xl tracking-widest leading-snug">珊珊書評</h1>
        <h2 class="font-display text-mauve-800 text-sm mt-2 tracking-widest leading-snug">Sam Reading TW</h2>
        <div class="w-10 h-px bg-petal-300 mx-auto mt-2 mb-2" />
        <p class="text-xs text-mauve-400 tracking-widest">日常 · 閱讀 · 感悟</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1">
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-md text-sm text-mauve-600 transition-all duration-200 hover:bg-white/60 hover:text-mauve-800 hover:shadow-sm group"
              :class="isActive(item.path) ? 'bg-white/70 text-mauve-800 shadow-sm shadow-petal-100 font-medium' : ''"
            >
              <component
                :is="item.icon"
                class="w-3 h-3 text-petal-400 transition-transform duration-200 group-hover:scale-125"
                :class="isActive(item.path) ? 'text-petal-500 scale-110' : ''"
              />
              {{ item.label }} <span class="text-[10px] text-mauve-300">{{ item.text }}</span>
              <span v-if="isActive(item.path)" class="ml-auto w-1 h-4 rounded-full bg-petal-400" />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="text-center pt-4 border-t border-petal-200/60">
        <p class="text-xs text-mauve-300 tracking-widest">Made with Samantha</p>
      </div>
    </div>
  </div>
</template>
