<script setup lang="ts">
withDefaults(defineProps<{
  baseY?: number
}>(), {
  baseY: 0.6,
})

const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number
let time = 0

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  const resize = () => {
    el.width = el.offsetWidth
    el.height = el.offsetHeight
  }

  const animate = () => {
    const { width: w, height: h } = el
    ctx.clearRect(0, 0, w, h)
    time += 0.007

    const waves = [
      { amp: h * 0.11, freq: 0.016, speed: 1.1, color: 'rgba(228, 205, 185, 0.42)', yFrac: 0.62, phase: 0 },
      { amp: h * 0.08, freq: 0.024, speed: 0.75, color: 'rgba(212, 188, 165, 0.32)', yFrac: 0.54, phase: Math.PI / 2.5 },
      { amp: h * 0.09, freq: 0.013, speed: 1.4, color: 'rgba(190, 160, 140, 0.14)', yFrac: 0.70, phase: Math.PI * 0.8 },
      { amp: h * 0.06, freq: 0.030, speed: 0.6, color: 'rgba(240, 225, 210, 0.38)', yFrac: 0.48, phase: Math.PI * 1.3 },
    ]

    waves.forEach(wave => {
      ctx.beginPath()
      ctx.moveTo(0, h * wave.yFrac)
      for (let x = 0; x <= w; x += 2) {
        const y = h * wave.yFrac + Math.sin(x * wave.freq + time * wave.speed + wave.phase) * wave.amp
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fillStyle = wave.color
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }

  resize()
  animate()

  const ro = new ResizeObserver(resize)
  ro.observe(el)
  onUnmounted(() => { ro.disconnect(); cancelAnimationFrame(animationId) })
})

onUnmounted(() => cancelAnimationFrame(animationId))
</script>

<template>
  <canvas ref="canvas" class="w-full h-full" />
</template>
