<script setup lang="ts">
  useHead({ title: "關於作者 — Samantha's World" })

  const infoCards = [
    { label: 'Location', value: '在島嶼的核心盆地，與環抱的群山一起守候這座多雨的城' },
    { label: 'Occupation', value: '在文獻的字裡行間打撈過往，為每段碎裂的歷史尋回座標。' },
    { label: 'Reading', value: '小說裡流浪、電影裡觀察；用他人敘事讀懂自身內心起伏。' },
    { label: 'Favorite', value: '著迷於揉搓兔毛時純粹靜謐，耽溺於舌尖冰涼茶香的微小確幸。' }
  ]

  const interests = ['閱讀', '手寫日記', '輕音樂', '散步', '咖啡館', '電影', '文具', '植物', '燭光', '老歌']

  const topItems = ['Samantha Cho']

  const bottomItems = [
    'A girl who spends her weekends buried in books.',
    'Severely picky when it comes to what she reads.'
  ]
</script>

<template>
  <div class="min-h-full relative">
    <!-- Hero canvas section -->
    <!-- <div class="relative h-72 overflow-hidden bg-petal-50">
      <canvas-wave-canvas class="absolute inset-0" />
      <canvas-sparkles class="absolute inset-0" />

      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-petal-200/40 pointer-events-none" />
      <div class="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-petal-300/30 pointer-events-none" />

      <div class="absolute inset-0 flex items-end px-10 pb-10">
        <div>
          <p class="text-petal-400 text-xs tracking-widest uppercase mb-2">About</p>
          <h1 class="font-display text-4xl text-mauve-800 leading-tight">Hello, I'm Sam</h1>
          <p class="text-mauve-400 mt-1 text-sm">一個喜歡閱讀、紀錄與慢慢生活的女孩</p>
        </div>
      </div>
    </div> -->
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
          <p class="text-mauve-600">
            假日總在看書的女子<br />
            嚴重的文字偏食症<br />
            有點挑惕有點刁鑽<br />
            偏好小說，偶爾上進的攝取一點學術書（真的是偶爾）
          </p>
          <p class="text-mauve-400 text-xs leading-[2.5] mt-2">
            A girl who spends her weekends buried in books.<br />
            Severely picky when it comes to what she reads.<br />
            A little particular, a little sharp.<br />
            Mostly into novels, with the occasional (and I mean occasional) attempt at something more academic.
          </p>
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
