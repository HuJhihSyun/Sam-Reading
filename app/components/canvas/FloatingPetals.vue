<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number

class Particle {
  x: number
  y: number
  size: number
  speedY: number
  swayAngle: number
  swaySpeed: number
  swayAmount: number
  angle: number
  rotationSpeed: number
  opacity: number
  color: string
  w: number
  h: number

  constructor(w: number, h: number, scattered = false) {
    this.w = w
    this.h = h
    this.x = Math.random() * w
    this.y = scattered ? Math.random() * h : h + Math.random() * 60
    this.size = Math.random() * 5 + 2
    this.speedY = Math.random() * 0.5 + 0.2
    this.swayAngle = Math.random() * Math.PI * 2
    this.swaySpeed = Math.random() * 0.012 + 0.004
    this.swayAmount = Math.random() * 1.5 + 0.5
    this.angle = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.018
    this.opacity = Math.random() * 0.35 + 0.08
    const colors = ['#f0dccb', '#e8ceba', '#d8bfaa', '#ecddd2', '#f5e9dc', '#d4c2b0', '#e0cfc0']
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.y -= this.speedY
    this.swayAngle += this.swaySpeed
    this.x += Math.sin(this.swayAngle) * this.swayAmount * 0.12
    this.angle += this.rotationSpeed
    if (this.y < -20) {
      this.y = this.h + 20
      this.x = Math.random() * this.w
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.ellipse(0, 0, this.size * 0.45, this.size, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  let particles: Particle[] = []

  const init = () => {
    el.width = el.offsetWidth
    el.height = el.offsetHeight
    const count = Math.max(12, Math.floor((el.width * el.height) / 7000))
    particles = Array.from({ length: count }, (_, i) => new Particle(el.width, el.height, i < count * 0.7))
  }

  const animate = () => {
    ctx.clearRect(0, 0, el.width, el.height)
    particles.forEach(p => { p.update(); p.draw(ctx) })
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
