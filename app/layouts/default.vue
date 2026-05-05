<script setup lang="ts">
  const { siteUrl } = useBlogConfig()
  const route = useRoute()

  useHead({
    link: computed(() => [{ rel: 'canonical', href: `${siteUrl}${route.path}` }])
  })

  watch(() => route.path, () => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
  })
</script>

<template>
  <div class="flex h-screen bg-petal-50 overflow-hidden font-serif">
    <!-- Sidebar (desktop only) -->
    <aside
      class="hidden md:block md:w-64 lg:w-72 xl:w-80 shrink-0 h-full bg-petal-50 border-r border-petal-200 relative z-30"
    >
      <AppSidebar />
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-white/80 min-w-0">
      <!-- Mobile top bar -->
      <div
        class="md:hidden flex items-center justify-between px-5 py-3 border-b border-petal-100 bg-petal-50/80 sticky top-0 z-30 backdrop-blur-md"
      >
        <span class="font-display text-mauve-700 text-sm tracking-widest">珊珊書評</span>
        <NuxtLink
          to="/about"
          class="w-7 h-7 rounded-full overflow-hidden border border-petal-200 bg-petal-100 flex items-center justify-center shrink-0"
        >
          <span class="font-display text-petal-500 text-xs font-semibold select-none">S</span>
        </NuxtLink>
      </div>

      <!-- Page content, padded at bottom for mobile nav -->
      <div class="pb-14 md:pb-0">
        <slot />
      </div>
    </main>
  </div>

  <!-- Mobile bottom nav -->
  <AppMobileNav />

  <GlobalLoadingOverlay />
</template>
