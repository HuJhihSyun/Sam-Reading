<script setup lang="ts">
  const route = useRoute()

  const navItems = [
    { path: '/about', label: '關於作者', icon: '✦' },
    { path: '/articles', label: '全部文章', icon: '✦' },
    { path: '/favorites', label: '喜歡的事物', icon: '✦' },
    { path: '/contact', label: '聯絡作者', icon: '✦' }
  ]

  const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <div class="relative h-full flex flex-col overflow-hidden">
    <!-- Canvas background -->
    <canvas-floating-petals class="absolute inset-0 pointer-events-none" />

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-linear-to-b from-petal-50/80 via-petal-100/60 to-petal-100/80 pointer-events-none"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col h-full px-5 py-8">
      <!-- Blog header -->
      <div class="text-center mb-10">
        <div
          class="w-14 h-14 mx-auto mb-4 rounded-full bg-linear-to-br from-petal-200 to-petal-400 flex items-center justify-center shadow-sm shadow-petal-200"
        >
          <span class="font-display text-white text-xl font-semibold select-none">S</span>
        </div>
        <h1 class="font-display text-mauve-800 text-2xl tracking-wide leading-snug">珊珊書評</h1>
        <h2 class="font-display text-mauve-800 text-base mt-2 tracking-wide leading-snug">Sam Reading TW</h2>
        <div class="w-10 h-px bg-petal-300 mx-auto mt-2 mb-2" />
        <p class="text-xs text-mauve-400 tracking-widest">日常 · 閱讀 · 感悟</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1">
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-mauve-600 transition-all duration-200 hover:bg-white/60 hover:text-mauve-800 hover:shadow-sm group"
              :class="isActive(item.path) ? 'bg-white/70 text-mauve-800 shadow-sm shadow-petal-100 font-medium' : ''"
            >
              <span
                class="text-petal-400 text-xs transition-transform duration-200 group-hover:scale-125"
                :class="isActive(item.path) ? 'text-petal-500 scale-110' : ''"
                >{{ item.icon }}</span
              >
              {{ item.label }}
              <span v-if="isActive(item.path)" class="ml-auto w-1 h-4 rounded-full bg-petal-400" />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="text-center pt-4 border-t border-petal-200/60">
        <p class="text-xs text-mauve-300 tracking-widest">Made with ♡</p>
      </div>
    </div>
  </div>
</template>
