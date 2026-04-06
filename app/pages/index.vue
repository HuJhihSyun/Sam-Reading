<script setup lang="ts">
  definePageMeta({ layout: 'default' })
  useHead({ title: "珊珊書評 — Sam's World" })

  // ── Brush path ────────────────────────────────────────────────
  const brushD =
    'M 0,60 C 55,40 120,74 210,56 C 300,38 380,68 480,52 C 580,36 660,65 760,50 C 848,37 912,60 965,50 C 982,47 994,53 1000,51'

  // ── Scroll & parallax ─────────────────────────────────────────
  const scrollY = ref(0)
  const vhVal = ref(0)

  // Brush stroke refs
  const brushSection = ref<HTMLElement | null>(null)
  const brushPath = ref<SVGPathElement | null>(null)
  const brushLen = ref(9999) // 初始設大值確保筆刷從隱藏開始
  const brushProgress = ref(0)

  const brushDashoffset = computed(() => (brushLen.value > 0 ? brushLen.value * (1 - brushProgress.value) : 9999))

  // Parallax styles (counteract scroll to create depth layers)
  const slowBg = computed(() => `translateY(${scrollY.value * 0.38}px) scale(1.12)`)
  const waveLayer = computed(() => `translateY(${scrollY.value * 0.22}px)`)
  const ghostText = computed(() => `translateY(${scrollY.value * 0.52}px)`)
  const heroContent = computed(() => `translateY(${scrollY.value * 0.08}px)`)

  // ── Article data ──────────────────────────────────────────────
  const articles = [
    {
      slug: 'morning-rituals',
      title: '清晨的儀式感',
      titleEn: 'Morning Rituals',
      date: '2026.03.20',
      tag: '生活',
      excerpt: '泡一杯熱茶，翻開日記，讓思緒在文字間慢慢甦醒。'
    },
    {
      slug: 'reading-notes-2025',
      title: '2025 年閱讀回顧',
      titleEn: 'Reading Notes',
      date: '2026.01.01',
      tag: '閱讀',
      excerpt: '三十二本書，每一本都留下了痕跡。'
    },
    {
      slug: 'autumn-walks',
      title: '秋天的散步記事',
      titleEn: 'Autumn Walks',
      date: '2025.11.08',
      tag: '日常',
      excerpt: '帶上耳機，漫無目的地走上一個小時。'
    },
    {
      slug: 'small-pleasures',
      title: '微小而確實的幸福',
      titleEn: 'Small Pleasures',
      date: '2025.09.15',
      tag: '感悟',
      excerpt: '幸福原來這麼輕，輕到幾乎不需要理由。'
    },
    {
      slug: 'letter-to-self',
      title: '給二十五歲的自己',
      titleEn: 'Letter to Self',
      date: '2025.07.03',
      tag: '成長',
      excerpt: '所有的答案都會在恰當的時候出現。'
    },
    {
      slug: 'favorite-cafes',
      title: '流連忘返的咖啡館',
      titleEn: 'Favorite Cafés',
      date: '2025.05.20',
      tag: '生活',
      excerpt: '在那裡，你可以好好與自己相處。'
    }
  ]

  // ── IntersectionObserver (fade-up) ───────────────────────────
  let io: IntersectionObserver | null = null

  onMounted(() => {
    vhVal.value = window.innerHeight

    // Init brush path length
    nextTick(() => {
      if (brushPath.value) {
        brushLen.value = brushPath.value.getTotalLength()
      }
    })

    const main = document.querySelector('main')
    if (!main) return

    // Scroll handler: parallax + brush progress
    const onScroll = () => {
      scrollY.value = main.scrollTop

      if (brushSection.value) {
        const rect = brushSection.value.getBoundingClientRect()
        const h = vhVal.value
        // Progress: 0 when element top is at 90% viewport → 1 when at 20%
        brushProgress.value = Math.max(0, Math.min(1, (h * 0.9 - rect.top) / (h * 0.7)))
      }
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
    <!-- Fixed paper noise — single instance for whole page -->
    <canvas-paper-noise :opacity="0.055" :speed="9999" :grain-size="1" class="fixed inset-0 pointer-events-none z-0" />

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
      <div class="absolute inset-0 flex flex-col justify-center px-10 z-20" :style="{ transform: heroContent }">
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
            Sam Reading TW
          </p>
        </div>

        <!-- Divider line -->
        <div class="flex items-center gap-3 mb-6 max-w-[220px] fade-up is-visible" style="transition-delay: 0.2s">
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
      <div class="absolute bottom-10 left-10 z-20 flex flex-col items-center gap-2 opacity-50">
        <span
          class="text-[8px] tracking-[0.5em] text-mauve-500 uppercase [writing-mode:vertical-rl] [letter-spacing:0.4em]"
          >Scroll</span
        >
        <div
          class="w-px h-14 bg-gradient-to-b from-mauve-400 to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]"
        />
      </div>

      <!-- Issue date (bottom-right) -->
      <div class="absolute bottom-10 right-10 z-20 text-right opacity-40">
        <p class="text-[8px] tracking-[0.3em] text-mauve-500 uppercase">Issue No.08</p>
        <p class="text-[8px] tracking-[0.3em] text-mauve-400 mt-0.5">April 2026</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         BRUSH STROKE (scroll-driven)
    ═════════════════════════════════════════════════════ -->
    <section ref="brushSection" class="relative z-10 py-6">
      <svg
        viewBox="0 0 1000 90"
        preserveAspectRatio="none"
        class="w-full h-[60px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Shadow stroke — wide, soft -->
        <path
          :d="brushD"
          stroke="#c4a898"
          stroke-width="18"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.18"
          fill="none"
          :stroke-dasharray="brushLen || 9999"
          :stroke-dashoffset="brushDashoffset"
        />
        <!-- Mid stroke -->
        <path
          :d="brushD"
          stroke="#a08070"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.35"
          fill="none"
          :stroke-dasharray="brushLen || 9999"
          :stroke-dashoffset="brushDashoffset"
        />
        <!-- Fine line — sharp ink edge -->
        <path
          ref="brushPath"
          :d="brushD"
          stroke="#584438"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.65"
          fill="none"
          :stroke-dasharray="brushLen || 9999"
          :stroke-dashoffset="brushDashoffset"
        />
      </svg>
    </section>

    <!-- ════════════════════════════════════════════════════
         ABOUT QUOTE
    ═════════════════════════════════════════════════════ -->
    <section class="relative z-10 px-10 py-16">
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
    <section class="relative z-10 px-10 py-16">
      <!-- Section heading -->
      <div class="fade-up flex items-center gap-4 mb-10">
        <h2 class="font-display text-xl text-mauve-800 shrink-0">精選文章</h2>
        <span class="text-mauve-300 text-xs shrink-0 tracking-widest">Featured</span>
        <div class="flex-1 h-px bg-petal-200" />
      </div>

      <!-- 3-column cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="(a, i) in articles.slice(0, 3)"
          :key="a.slug"
          :to="`/articles/${a.slug}`"
          class="fade-up group block"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <article
            class="h-full border border-petal-100 rounded-2xl p-6 bg-white/40 hover:bg-white/70 hover:border-petal-200 hover:shadow-sm hover:shadow-petal-100/50 transition-all duration-300 flex flex-col"
          >
            <p class="text-[9px] tracking-[0.4em] text-petal-500 uppercase mb-3">{{ a.tag }}</p>
            <h3
              class="font-display text-base text-mauve-800 leading-snug mb-1 group-hover:text-mauve-700 transition-colors"
            >
              {{ a.title }}
            </h3>
            <p class="text-[11px] text-mauve-400 font-display italic mb-3">{{ a.titleEn }}</p>
            <p class="text-xs text-mauve-500 leading-6 flex-1">{{ a.excerpt }}</p>
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-petal-100/80">
              <time class="text-[10px] text-mauve-300 tracking-wide">{{ a.date }}</time>
              <span class="text-petal-400 text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </article>
        </NuxtLink>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         LATEST ARTICLES  (Japanese editorial list style)
    ═════════════════════════════════════════════════════ -->
    <section class="relative z-10 px-10 py-16 pb-28">
      <!-- Section heading -->
      <div class="fade-up flex items-center gap-4 mb-8">
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
              <span class="text-[9px] text-petal-400 bg-petal-50 px-2 py-0.5 rounded-full shrink-0 tracking-wide">{{
                a.tag
              }}</span>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <time class="text-[10px] text-mauve-300">{{ a.date }}</time>
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
