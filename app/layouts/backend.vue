<script setup lang="ts">
  import { useContactApi } from '@/composables/api/useContactApi'
  const { getContact } = useContactApi()

  const route = useRoute()

  const navItems = [
    { path: '/backend', label: 'Dashboard', icon: '◈', exact: true },
    { path: '/backend/articles', label: '文章管理', icon: '✦' },
    { path: '/backend/about', label: '關於作者', icon: '◎' },
    { path: '/backend/contacts', label: '聯絡訊息', icon: '◇' }
  ]

  const isActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) return route.path === item.path
    return route.path === item.path || route.path.startsWith(item.path + '/')
  }

  const unread = ref(0)

  const fetchContact = async () => {
    try {
      const res: any = await getContact()
      unread.value = res.data.filter((m: any) => !m.read).length
    } catch (error) {
      console.error('Error fetching contact data:', error)
    }
  }

  onMounted(() => {
    fetchContact()
  })
</script>

<template>
  <div class="min-h-screen flex bg-neutral-950 text-neutral-200 font-sans">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 flex flex-col border-r border-neutral-800 bg-neutral-900">
      <!-- Logo -->
      <div class="px-6 py-6 border-b border-neutral-800">
        <NuxtLink to="/backend" class="block">
          <p class="text-xs text-neutral-500 tracking-widest uppercase mb-0.5">Admin Panel</p>
          <h1 class="text-white font-semibold tracking-wide text-sm">珊珊書評</h1>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4">
        <ul class="space-y-0.5">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150"
              :class="
                isActive(item)
                  ? 'bg-neutral-700/70 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              "
            >
              <span class="text-[10px] opacity-60">{{ item.icon }}</span>
              {{ item.label }}
              <span
                v-if="item.path === '/backend/contacts' && unread > 0"
                class="ml-auto text-[10px] bg-rose-500/80 text-white px-1.5 py-0.5 rounded-full leading-none"
              >
                {{ unread }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Bottom -->
      <div class="px-6 py-4 border-t border-neutral-800">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <span>←</span>
          <span>返回前台</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="h-12 shrink-0 border-b border-neutral-800 flex items-center px-6 gap-3">
        <nav class="flex items-center gap-1.5 text-xs text-neutral-500">
          <span>後台管理</span>
          <template v-if="route.path !== '/backend'">
            <span class="opacity-40">/</span>
            <span class="text-neutral-300 capitalize">
              {{ route.path.replace('/backend/', '').split('/')[0] }}
            </span>
          </template>
        </nav>
        <div class="ml-auto text-xs text-neutral-600">
          {{ new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 overflow-y-auto p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
