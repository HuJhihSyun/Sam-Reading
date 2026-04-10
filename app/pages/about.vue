<script setup lang="ts">
  import { useAboutApi } from '@/composables/api/useAboutApi'
  import type { AboutData } from '@/types'
  const { getAbout } = useAboutApi()
  const { buildPageTitle, defaultDescription } = useSiteConfig()

  const message = ref('')
  const messageEn = ref('')
  const infoCards = ref<{ label: string; value: string }[]>([])
  const interests = ref<string[]>([])
  const topItems = ref<string[]>([])
  const bottomItems = ref<string[]>([
    'A girl who spends her weekends buried in books.',
    'Severely picky when it comes to what she reads.'
  ])

  const { data: aboutData } = await useAsyncData<AboutData>(`about-data`, () => getAbout() as Promise<AboutData>)

  message.value = aboutData.value?.message.replace(/\n/g, '<br />') ?? ''
  messageEn.value = aboutData.value?.messageEn.replace(/\n/g, '<br />') ?? ''
  infoCards.value = aboutData.value?.infoCards ?? []
  interests.value = aboutData.value?.interests ?? []
  topItems.value = [aboutData.value?.name ?? '']

  const description = message.value ? message.value.replace(/<br \/>/g, ',').trimEnd() : defaultDescription
  const pageTitle = buildPageTitle('關於作者')

  useSeoMeta({
    title: pageTitle,
    description: description,
    ogTitle: pageTitle,
    ogDescription: description,
    ogType: 'profile',
    twitterCard: 'summary',
    twitterTitle: pageTitle,
    twitterDescription: description
  })
</script>

<template>
  <div class="min-h-full relative">
    <canvas-paper-noise :opacity="0.05" :grain-size="1" class="absolute inset-0 pointer-events-none z-0" />

    <span
      class="fixed top-0 right-0 text-[15vw] leading-none text-mauve-400 opacity-10 font-extrabold font-display z-0"
    >
      About<br />
      Author
    </span>

    <!-- Content -->
    <div class="relative py-12 z-10">
      <div class="flex justify-center text-mauve-700 leading-8 px-10">
        <h2 class="w-1/5">Message</h2>
        <div class="w-4/5">
          <p class="text-mauve-600" v-html="message"></p>
          <p class="text-mauve-400 text-xs leading-[2.5] mt-2" v-html="messageEn"></p>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-10 px-10">
        <div class="flex-1 h-px bg-petal-200" />
        <span class="text-petal-300 text-xs tracking-widest">✦ ✦ ✦</span>
        <div class="flex-1 h-px bg-petal-200" />
      </div>

      <!-- Info cards -->
      <div class="flex justify-center text-mauve-700 px-10">
        <h2 class="w-1/5">Information</h2>
        <div class="w-4/5 grid grid-cols-2 gap-4">
          <div
            v-for="card in infoCards"
            :key="card.label"
            class="p-5 rounded-xl bg-petal-100/30 border border-petal-200 backdrop-blur-xs"
          >
            <p class="text-xs text-petal-400 tracking-widest mb-1">{{ card.label }}</p>
            <p class="text-mauve-600 text-xs font-medium tracking-wide">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <div class="w-full bg-mauve-700 my-14 py-10">
        <h4 class="text-petal-100 px-10">Hello, my name is</h4>
        <div class="overflow-hidden w-full">
          <div
            class="marquee-row--top flex whitespace-nowrap text-[10vw] font-extrabold text-petal-200 leading-snug"
            style="will-change: transform"
          >
            <div class="flex">
              <span v-for="n in 2" :key="n" class="marquee-item">
                <template v-for="(item, i) in topItems" :key="i"> {{ item }}<span class="sep">·</span> </template>
              </span>
            </div>
          </div>

          <div
            class="marquee-row--bottom flex whitespace-nowrap text-xl text-petal-300 leading-normal"
            style="will-change: transform"
          >
            <div class="flex">
              <span v-for="n in 2" :key="n" class="marquee-item">
                <template v-for="(item, i) in bottomItems" :key="i"> {{ item }}<span class="sep">·</span> </template>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div class="mt-10 px-10">
        <h2 class="font-display text-mauve-700 mb-5">Favorites</h2>
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

<style scoped>
  .marquee-row--top {
    animation: scroll-left 56s linear infinite;
  }

  .marquee-row--bottom {
    animation: scroll-left 28s linear infinite;
  }

  .sep {
    margin: 0 1.5rem;
    opacity: 0.3;
  }

  @keyframes scroll-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }
</style>
