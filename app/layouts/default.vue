<script setup lang="ts">
  import { ref } from 'vue'

  const isMobileOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-petal-50 overflow-hidden font-serif">
    <!-- Sidebar -->
    <aside
      class="hidden md:block md:w-64 lg:w-72 xl:w-80 shrink-0 h-full bg-petal-50 border-r border-petal-200 relative z-30 lg:relative transition-transform duration-300 ease-in-out lg:translate-x-0"
    >
      <AppSidebar />
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-white/80 min-w-0">
      <!-- Mobile header -->
      <div
        class="lg:hidden flex items-center gap-3 px-5 py-4 border-b border-petal-100 bg-white/90 sticky top-0 z-10 backdrop-blur-md"
      >
        <button class="p-2 rounded-lg text-mauve-500 hover:bg-petal-100 transition-colors" @click="isMobileOpen = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="font-display text-mauve-700 text-sm">Sam's World</span>
      </div>

      <slot />
    </main>
  </div>

  <GlobalLoadingOverlay />
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
