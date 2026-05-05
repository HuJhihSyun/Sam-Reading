<script setup lang="ts">
  import { useArticleApi } from '@/composables/api/useArticleApi'
  import type { Article } from '@/types'
  const { getArticle } = useArticleApi()
  const { siteName, defaultDescription } = useBlogConfig()
  const { applyWebsiteSchema } = useSchemas()

  definePageMeta({ layout: 'default' })
  applyWebsiteSchema()
  useSeoMeta({
    title: siteName,
    description: defaultDescription,
    ogTitle: siteName,
    ogDescription: defaultDescription,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: siteName,
    twitterDescription: defaultDescription
  })

  // ── Scroll & parallax ─────────────────────────────────────
  const scrollY = ref(0)
  const vhVal = ref(0)

  // Parallax styles (counteract scroll to create depth layers)
  const waveLayer = computed(() => `translateY(${scrollY.value * 0.3}px)`)
  const ghostText = computed(() => `translateY(${scrollY.value * 0.52}px)`)
  const heroContent = computed(() => `translateY(${scrollY.value * 0.1}px)`)

  // ── Article data ──────────────────────────────────────────────
  const articles = ref(null as Article[] | null)

  const { data: articleData } = await useAsyncData(`articles`, () => getArticle())

  articles.value = (articleData.value?.data as Article[]) || []

  // ── IntersectionObserver (fade-up) ───────────────────────────
  let io: IntersectionObserver | null = null

  onMounted(() => {
    vhVal.value = window.innerHeight

    const main = document.querySelector('main')
    if (!main) return

    // Scroll handler: parallax
    const onScroll = () => {
      scrollY.value = main.scrollTop
    }
    main.addEventListener('scroll', onScroll, { passive: true })

    // IntersectionObserver for .fade-up elements
    nextTick(() => {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('is-visible')
          }),
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px', root: main }
      )
      document.querySelectorAll('.fade-up').forEach((el) => io!.observe(el))
    })

    onUnmounted(() => {
      main.removeEventListener('scroll', onScroll)
      io?.disconnect()
    })
  })
</script>

<template>
  <div class="relative">
    <div class="absolute w-3/5 h-full">
      <!-- paper noise — single instance for whole page -->
      <canvas-paper-noise :opacity="0.05" :grain-size="1" class="absolute inset-0 pointer-events-none z-0" />
    </div>

    <!-- ════════════════════════════════════════════════════
         HERO
    ═════════════════════════════════════════════════════ -->
    <section class="relative h-screen overflow-hidden z-10">
      <!-- Ghost large background text (fastest parallax) -->
      <div
        class="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none select-none overflow-hidden"
        :style="{ transform: ghostText }"
      >
        <span
          class="font-display font-black leading-[0.85] text-mauve-900 opacity-[0.035]"
          style="font-size: clamp(7rem, 22vw, 18rem)"
        >
          READ
        </span>
      </div>

      <!-- Decorative thin circle -->
      <div
        class="absolute -top-[25vw] -right-[25vw] w-[50vw] h-[50vw] rounded-full border border-petal-300/20 pointer-events-none"
        :style="{ transform: waveLayer }"
      />
      <div
        class="absolute -top-[15vw] -right-[15vw] w-[30vw] h-[30vw] rounded-full border border-petal-200/25 pointer-events-none"
        :style="{ transform: waveLayer }"
      />

      <!-- Hero content (slowest parallax — stays longest) -->
      <div class="absolute inset-0 flex flex-col justify-center px-5 md:px-10 z-20" :style="{ transform: heroContent }">
        <!-- Eyebrow -->
        <p class="text-[9px] tracking-[0.45em] text-mauve-400 uppercase mb-7 fade-up is-visible">
          Personal Blog — Est. 2024
        </p>

        <!-- Title block -->
        <div class="mb-7 fade-up is-visible" style="transition-delay: 0.1s">
          <h1 class="font-display font-semibold leading-snug">
            <span class="block text-mauve-800" style="font-size: clamp(3.5rem, 9vw, 7rem); letter-spacing: -0.01em"
              >珊珊書評</span
            >
          </h1>
          <p
            class="font-display italic text-mauve-400 mt-2 tracking-widest"
            style="font-size: clamp(0.85rem, 2vw, 1.25rem)"
          >
            Samantha Reading TW
          </p>
        </div>

        <!-- Divider line -->
        <div class="flex items-center gap-3 mb-6 max-w-55 fade-up is-visible" style="transition-delay: 0.2s">
          <div class="h-px flex-1 bg-petal-300" />
          <span class="text-petal-400 text-[9px] tracking-widest">✦</span>
          <div class="h-px flex-1 bg-petal-300" />
        </div>

        <!-- Tagline -->
        <p class="text-mauve-500 text-xs tracking-[0.25em] mb-10 fade-up is-visible" style="transition-delay: 0.3s">
          日常 · 閱讀 · 感悟
        </p>

        <!-- CTA -->
        <div class="fade-up is-visible" style="transition-delay: 0.45s">
          <NuxtLink
            to="/articles"
            class="inline-flex items-center gap-2.5 text-[10px] text-mauve-600 tracking-[0.3em] uppercase hover:text-mauve-900 transition-colors duration-200 group"
          >
            <span>查看全部文章</span>
            <span class="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll indicator (bottom-left) -->
      <div
        class="absolute bottom-28 md:bottom-10 left-auto right-5 md:right-auto md:left-10 z-20 flex flex-col items-center gap-2 opacity-50"
      >
        <span class="text-[8px] tracking-[0.5em] text-mauve-500 uppercase [writing-mode:vertical-rl]">Scroll</span>
        <div
          class="w-px h-14 bg-linear-to-b from-mauve-400 to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]"
        />
      </div>

      <!-- Issue date (bottom-right) -->
      <div class="hidden md:block absolute bottom-10 right-10 z-20 text-right opacity-40">
        <p class="text-[8px] tracking-[0.3em] text-mauve-500 uppercase">Issue No.08</p>
        <p class="text-[8px] tracking-[0.3em] text-mauve-400 mt-0.5">April 2026</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         ABOUT QUOTE
    ═════════════════════════════════════════════════════ -->
    <section class="relative z-10 px-5 md:px-10 py-12 md:py-16">
      <div class="max-w-xl">
        <p class="fade-up text-[9px] tracking-[0.45em] text-mauve-400 uppercase mb-5">About the Author</p>
        <blockquote
          class="fade-up font-display leading-[1.55] text-mauve-800 mb-5"
          style="font-size: clamp(1.3rem, 3vw, 1.9rem); transition-delay: 0.1s"
        >
          "假日總在看書的女子，<br />嚴重的文字偏食症。"
        </blockquote>
        <p class="fade-up text-sm text-mauve-500 leading-7 max-w-sm" style="transition-delay: 0.2s">
          這裡是我用來記錄閱讀感受、日常碎片與生活感悟的地方。 沒有特定主題，只有真實的文字與柔軟的心情。
        </p>
        <NuxtLink
          to="/about"
          class="fade-up mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.35em] text-mauve-500 uppercase hover:text-mauve-800 transition-colors group"
          style="transition-delay: 0.3s"
        >
          <span>了解更多</span>
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        FEATURED ARTICLES
    ═════════════════════════════════════════════════════ -->
    <section class="relative z-10 px-5 md:px-10 py-12 md:py-16">
      <!-- Section heading -->
      <div class="fade-up flex items-center gap-4 mb-6 md:mb-10">
        <h2 class="font-display text-xl text-mauve-800 shrink-0">精選文章</h2>
        <span class="text-mauve-300 text-xs shrink-0 tracking-widest">Featured</span>
        <div class="flex-1 h-px bg-petal-200" />
      </div>

      <!-- 3-column cards -->
      <div v-if="articles && articles.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <NuxtLink
          v-for="(a, i) in articles.slice(0, 3)"
          :key="a.slug"
          :to="`/articles/${a.slug}`"
          class="fade-up group block"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <article
            class="h-full border border-petal-100 rounded-2xl p-4 md:p-6 bg-white/40 hover:bg-white/70 hover:border-petal-200 hover:shadow-sm hover:shadow-petal-100/50 transition-all duration-300 flex flex-col"
          >
            <div class="flex justify-start items-center gap-1 mb-2">
              <span
                v-for="tag in a.tags"
                :key="tag"
                class="text-[9px] text-petal-500 bg-petal-100 px-2 py-0.5 rounded"
                >{{ tag }}</span
              >
            </div>
            <h3
              class="font-display text-base text-mauve-800 leading-snug mb-1 group-hover:text-mauve-700 transition-colors line-clamp-1"
            >
              {{ a.title }}
            </h3>
            <p class="text-xs text-mauve-500 leading-6 flex-1 line-clamp-3">{{ a.excerpt }}</p>
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-petal-100/80">
              <time class="text-[10px] text-mauve-300 tracking-wide">{{ a.publishDate }}</time>
              <span class="text-petal-400 text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </article>
        </NuxtLink>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        LATEST ARTICLES  (Japanese editorial list style)
    ═════════════════════════════════════════════════════ -->
    <section class="relative z-10 px-5 md:px-10 py-12 md:py-16 pb-16 md:pb-28">
      <!-- Section heading -->
      <div class="fade-up flex items-center gap-4 mb-6 md:mb-8">
        <h2 class="font-display text-xl text-mauve-800 shrink-0">最新文章</h2>
        <span class="text-mauve-300 text-xs shrink-0 tracking-widest">Latest</span>
        <div class="flex-1 h-px bg-petal-200" />
      </div>

      <!-- List -->
      <ul class="max-w-2xl divide-y divide-petal-100/80">
        <li v-for="(a, i) in articles" :key="a.slug" class="fade-up" :style="{ transitionDelay: `${i * 0.07}s` }">
          <NuxtLink :to="`/articles/${a.slug}`" class="flex items-center justify-between gap-4 py-4 group">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-petal-300 text-[10px] shrink-0">✦</span>
              <span class="text-sm text-mauve-700 group-hover:text-mauve-900 transition-colors truncate">{{
                a.title
              }}</span>
              <!-- <span class="text-[9px] text-petal-400 bg-petal-50 px-2 py-0.5 rounded-full shrink-0 tracking-wide">{{
                a.tag
              }}</span> -->
              <div class="hidden md:flex justify-start items-center gap-1">
                <span
                  v-for="tag in a.tags"
                  :key="tag"
                  class="text-[9px] text-petal-500 bg-petal-100 px-2 py-0.5 rounded"
                  >{{ tag }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <time class="text-[10px] text-mauve-300">{{ a.publishDate }}</time>
              <span class="text-mauve-300 text-xs transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <!-- All articles CTA -->
      <div class="fade-up mt-10" style="transition-delay: 0.5s">
        <NuxtLink
          to="/articles"
          class="inline-flex items-center gap-3 px-7 py-3 border border-petal-200 rounded-full text-[10px] text-mauve-600 tracking-[0.3em] uppercase hover:border-petal-300 hover:text-mauve-800 hover:bg-white/50 transition-all duration-200 group"
        >
          <span>查看全部文章</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
  /* ── Fade-up animation base state ───────────────────────── */
  .fade-up {
    opacity: 0;
    transform: translateY(22px);
    transition:
      opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .fade-up.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Scroll pulse animation (hero indicator) ────────────── */
  @keyframes scrollPulse {
    0%,
    100% {
      opacity: 0.3;
      transform: scaleY(0.8);
    }
    50% {
      opacity: 1;
      transform: scaleY(1);
    }
  }
</style>
