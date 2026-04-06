<template>
  <canvas ref="canvasRef" />
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'

  interface Props {
    /** 雜訊透明度 0~1，配合淺色系底色建議 0.04~0.1 */
    opacity?: number
    /** 每幀間隔 ms，預設 120 */
    speed?: number
    /** 顆粒大小 px，預設 1 */
    grainSize?: number
    /** 是否啟用，預設 true */
    enabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    opacity: 0.1,
    speed: 120,
    grainSize: 2,
    enabled: true
  })

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animFrameId: number | null = null
  let lastTimestamp = 0
  let resizeObserver: ResizeObserver | null = null

  function drawNoise(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const gs = Math.max(1, Math.round(props.grainSize))
    const alpha = Math.round(props.opacity * 255)
    const imageData = ctx.createImageData(w, h)
    const data = imageData.data

    for (let y = 0; y < h; y += gs) {
      for (let x = 0; x < w; x += gs) {
        const v = (Math.random() * 255) | 0
        for (let dy = 0; dy < gs && y + dy < h; dy++) {
          for (let dx = 0; dx < gs && x + dx < w; dx++) {
            const i = ((y + dy) * w + (x + dx)) * 4
            data[i] = v
            data[i + 1] = v
            data[i + 2] = v
            data[i + 3] = alpha
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  function syncSize(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement
    if (!parent) return

    // devicePixelRatio 處理，讓 Retina 螢幕不模糊
    const dpr = window.devicePixelRatio || 1
    const { offsetWidth: w, offsetHeight: h } = parent

    // 避免不必要的重設（會清掉畫面）
    if (canvas.width === w * dpr && canvas.height === h * dpr) return

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
  }

  function loop(ts: number) {
    if (!props.enabled) return

    const canvas = canvasRef.value
    if (canvas) {
      if (ts - lastTimestamp >= props.speed) {
        syncSize(canvas)
        drawNoise(canvas)
        lastTimestamp = ts
      }
    }

    animFrameId = requestAnimationFrame(loop)
  }

  function start() {
    stop()
    lastTimestamp = 0
    animFrameId = requestAnimationFrame(loop)
  }

  function stop() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    // 監聽父元素 resize（側選單寬度變化、視窗縮放都能處理到）
    resizeObserver = new ResizeObserver(() => {
      const c = canvasRef.value
      if (c) syncSize(c)
    })
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    if (props.enabled) start()
  })

  onUnmounted(() => {
    stop()
    resizeObserver?.disconnect()
  })

  watch(
    () => props.enabled,
    (val) => {
      val ? start() : stop()
    }
  )
</script>
