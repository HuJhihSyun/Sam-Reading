<script setup lang="ts">
  const route = useRoute()

  const navItems = [
    {
      path: '/',
      label: '首頁',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`
    },
    {
      path: '/about',
      label: '關於',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
    },
    {
      path: '/articles',
      label: '文章',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`
    },
    {
      path: '/favorites',
      label: '喜歡',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`
    },
    {
      path: '/contact',
      label: '聯絡',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
    }
  ]

  const isActive = (path: string) =>
    path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-petal-50/95 backdrop-blur-md border-t border-petal-200 safe-bottom"
  >
    <ul class="flex items-stretch h-14">
      <li v-for="item in navItems" :key="item.path" class="flex-1">
        <NuxtLink
          :to="item.path"
          class="flex flex-col items-center justify-center gap-0.5 h-full transition-colors"
          :class="isActive(item.path) ? 'text-petal-600' : 'text-mauve-400'"
        >
          <span class="w-5 h-5" v-html="item.icon" />
          <span class="text-[9px] tracking-wide">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
