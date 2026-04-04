<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number
let time = 0

interface Star {
  x: number; y: number; size: number
  speed: number; phase: number; color: string
}

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, opacity: number, color: string) => {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = r * 0.55
  ctx.lineCap = 'round'
  ctx.translate(x, y)
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * r * 2.2, Math.sin(a) * r * 2.2)
  }
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  let stars: Star[] = []
  const colors = ['#d4bfb0', '#c8b0a0', '#e8d8cc', '#b8a898', '#ddc8b8', '#c4b0a8']

  const init = () => {
    el.width = el.offsetWidth
    el.height = el.offsetHeight
    const count = Math.max(20, Math.floor((el.width * el.height) / 4500))
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * el.width,
      y: Math.random() * el.height,
      size: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.018 + 0.006,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }

  const animate = () => {
    ctx.clearRect(0, 0, el.width, el.height)
    time += 0.016
    stars.forEach(s => {
      const opacity = ((Math.sin(time * s.speed * 55 + s.phase) + 1) / 2) * 0.75
      drawStar(ctx, s.x, s.y, s.size, opacity, s.color)
    })
    animationId = requestAnimationFrame(animate)
  }

  init()
  animate()

  const ro = new ResizeObserver(init)
  ro.observe(el)
  onUnmounted(() => { ro.disconnect(); cancelAnimationFrame(animationId) })
})

onUnmounted(() => cancelAnimationFrame(animationId))
</script>

<template>
  <canvas ref="canvas" class="w-full h-full" />
</template>
