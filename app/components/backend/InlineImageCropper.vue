<script setup lang="ts">
const props = defineProps<{
  open: boolean
  slug: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  done: [path: string]
}>()

// ── Aspect ratios ─────────────────────────────────────────
const RATIOS = [
  { label: '自由', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 }
]
const selectedRatio = ref(0) // 0 = free

// ── Canvas state ──────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)

const CANVAS_W = 760
const CANVAS_H = 480

// Image transform
const imgX = ref(0)
const imgY = ref(0)
const imgScale = ref(1)
const imgNaturalW = ref(0)
const imgNaturalH = ref(0)

// Crop box (in canvas px)
const cropX = ref(0)
const cropY = ref(0)
const cropW = ref(CANVAS_W)
const cropH = ref(CANVAS_H)

// ── File input ────────────────────────────────────────────
const fileInput = ref<HTMLInputElement | null>(null)
const hasImage = ref(false)
const uploading = ref(false)
const errorMsg = ref('')
const customFilename = ref('')

// ── Drag state ────────────────────────────────────────────
const dragging = ref(false)
const dragOrigin = ref({ x: 0, y: 0, ix: 0, iy: 0 })

// Crop box resize
type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | null
const resizing = ref<ResizeHandle>(null)
const resizeOrigin = ref({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 })

watch(() => props.open, (val) => {
  if (val) {
    hasImage.value = false
    errorMsg.value = ''
    selectedRatio.value = 0
    customFilename.value = ''
    nextTick(() => fileInput.value?.click())
  }
})

// ── Init crop box ─────────────────────────────────────────
function initCropBox() {
  if (selectedRatio.value === 0) {
    cropX.value = 0; cropY.value = 0
    cropW.value = CANVAS_W; cropH.value = CANVAS_H
  } else {
    const r = selectedRatio.value
    let w = CANVAS_W
    let h = Math.round(w / r)
    if (h > CANVAS_H) { h = CANVAS_H; w = Math.round(h * r) }
    cropX.value = Math.round((CANVAS_W - w) / 2)
    cropY.value = Math.round((CANVAS_H - h) / 2)
    cropW.value = w; cropH.value = h
  }
}

watch(selectedRatio, () => { initCropBox(); draw() })

// ── File selection ────────────────────────────────────────
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) { close(); return }
  if (!file.type.startsWith('image/')) { errorMsg.value = '請選擇圖片檔案'; return }

  const reader = new FileReader()
  reader.onload = (ev) => {
    const src = ev.target?.result as string
    const img = new Image()
    img.onload = () => {
      imgEl.value = img
      imgNaturalW.value = img.width
      imgNaturalH.value = img.height
      const scaleX = CANVAS_W / img.width
      const scaleY = CANVAS_H / img.height
      imgScale.value = Math.max(scaleX, scaleY)
      imgX.value = (CANVAS_W - img.width * imgScale.value) / 2
      imgY.value = (CANVAS_H - img.height * imgScale.value) / 2
      hasImage.value = true
      initCropBox()
      nextTick(draw)
    }
    img.src = src
  }
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

// ── Draw ──────────────────────────────────────────────────
function draw() {
  const canvas = canvasRef.value
  const img = imgEl.value
  if (!canvas || !img) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

  // Image
  ctx.drawImage(img, imgX.value, imgY.value, img.width * imgScale.value, img.height * imgScale.value)

  // Dim outside crop
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, CANVAS_W, cropY.value)
  ctx.fillRect(0, cropY.value + cropH.value, CANVAS_W, CANVAS_H - cropY.value - cropH.value)
  ctx.fillRect(0, cropY.value, cropX.value, cropH.value)
  ctx.fillRect(cropX.value + cropW.value, cropY.value, CANVAS_W - cropX.value - cropW.value, cropH.value)

  // Crop border
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(cropX.value, cropY.value, cropW.value, cropH.value)

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 0.5
  for (let i = 1; i < 3; i++) {
    const gx = cropX.value + (cropW.value / 3) * i
    const gy = cropY.value + (cropH.value / 3) * i
    ctx.beginPath(); ctx.moveTo(gx, cropY.value); ctx.lineTo(gx, cropY.value + cropH.value); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cropX.value, gy); ctx.lineTo(cropX.value + cropW.value, gy); ctx.stroke()
  }

  // Corner handles
  const hs = 8
  ctx.fillStyle = 'white'
  const corners = [
    [cropX.value, cropY.value],
    [cropX.value + cropW.value, cropY.value],
    [cropX.value, cropY.value + cropH.value],
    [cropX.value + cropW.value, cropY.value + cropH.value]
  ]
  for (const [x, y] of corners) {
    ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs)
  }
}

// ── Cursor helper ─────────────────────────────────────────
function getCursor(x: number, y: number): string {
  const hs = 10
  const near = (px: number, py: number) => Math.abs(x - px) < hs && Math.abs(y - py) < hs
  if (near(cropX.value, cropY.value) || near(cropX.value + cropW.value, cropY.value + cropH.value)) return 'nwse-resize'
  if (near(cropX.value + cropW.value, cropY.value) || near(cropX.value, cropY.value + cropH.value)) return 'nesw-resize'
  const inside = x > cropX.value && x < cropX.value + cropW.value && y > cropY.value && y < cropY.value + cropH.value
  if (inside) return 'move'
  return 'crosshair'
}

function canvasCoords(e: MouseEvent): { x: number; y: number } {
  const rect = canvasRef.value!.getBoundingClientRect()
  return {
    x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
    y: ((e.clientY - rect.top) / rect.height) * CANVAS_H
  }
}

// ── Pointer events ────────────────────────────────────────
function onMouseDown(e: MouseEvent) {
  const { x, y } = canvasCoords(e)
  const hs = 10
  const near = (px: number, py: number) => Math.abs(x - px) < hs && Math.abs(y - py) < hs

  if (near(cropX.value, cropY.value)) {
    resizing.value = 'tl'
  } else if (near(cropX.value + cropW.value, cropY.value)) {
    resizing.value = 'tr'
  } else if (near(cropX.value, cropY.value + cropH.value)) {
    resizing.value = 'bl'
  } else if (near(cropX.value + cropW.value, cropY.value + cropH.value)) {
    resizing.value = 'br'
  } else {
    const inside = x > cropX.value && x < cropX.value + cropW.value && y > cropY.value && y < cropY.value + cropH.value
    if (inside) {
      dragging.value = true
      dragOrigin.value = { x, y, ix: cropX.value, iy: cropY.value }
    }
    return
  }
  resizeOrigin.value = { x, y, cx: cropX.value, cy: cropY.value, cw: cropW.value, ch: cropH.value }
}

function clampCrop() {
  cropX.value = Math.max(0, Math.min(cropX.value, CANVAS_W - cropW.value))
  cropY.value = Math.max(0, Math.min(cropY.value, CANVAS_H - cropH.value))
  cropW.value = Math.max(30, Math.min(cropW.value, CANVAS_W - cropX.value))
  cropH.value = Math.max(30, Math.min(cropH.value, CANVAS_H - cropY.value))
}

function onMouseMove(e: MouseEvent) {
  const { x, y } = canvasCoords(e)
  if (canvasRef.value) canvasRef.value.style.cursor = getCursor(x, y)

  if (dragging.value) {
    cropX.value = dragOrigin.value.ix + (x - dragOrigin.value.x)
    cropY.value = dragOrigin.value.iy + (y - dragOrigin.value.y)
    clampCrop()
    draw()
    return
  }

  if (!resizing.value) return
  const { cx, cy, cw, ch } = resizeOrigin.value
  const dx = x - resizeOrigin.value.x
  const dy = y - resizeOrigin.value.y

  if (selectedRatio.value !== 0) {
    // Constrained resize
    const r = selectedRatio.value
    if (resizing.value === 'br') {
      cropW.value = Math.max(30, cw + dx)
      cropH.value = Math.round(cropW.value / r)
    } else if (resizing.value === 'tl') {
      cropW.value = Math.max(30, cw - dx)
      cropH.value = Math.round(cropW.value / r)
      cropX.value = cx + cw - cropW.value
      cropY.value = cy + ch - cropH.value
    } else if (resizing.value === 'tr') {
      cropW.value = Math.max(30, cw + dx)
      cropH.value = Math.round(cropW.value / r)
      cropY.value = cy + ch - cropH.value
    } else if (resizing.value === 'bl') {
      cropW.value = Math.max(30, cw - dx)
      cropH.value = Math.round(cropW.value / r)
      cropX.value = cx + cw - cropW.value
    }
  } else {
    // Free resize
    if (resizing.value === 'br') {
      cropW.value = Math.max(30, cw + dx); cropH.value = Math.max(30, ch + dy)
    } else if (resizing.value === 'tl') {
      cropW.value = Math.max(30, cw - dx); cropH.value = Math.max(30, ch - dy)
      cropX.value = cx + cw - cropW.value; cropY.value = cy + ch - cropH.value
    } else if (resizing.value === 'tr') {
      cropW.value = Math.max(30, cw + dx); cropH.value = Math.max(30, ch - dy)
      cropY.value = cy + ch - cropH.value
    } else if (resizing.value === 'bl') {
      cropW.value = Math.max(30, cw - dx); cropH.value = Math.max(30, ch + dy)
      cropX.value = cx + cw - cropW.value
    }
  }
  clampCrop()
  draw()
}

function onMouseUp() {
  dragging.value = false
  resizing.value = null
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.08 : 0.92
  const rect = canvasRef.value!.getBoundingClientRect()
  const cx = ((e.clientX - rect.left) / rect.width) * CANVAS_W
  const cy = ((e.clientY - rect.top) / rect.height) * CANVAS_H
  imgX.value = cx + (imgX.value - cx) * factor
  imgY.value = cy + (imgY.value - cy) * factor
  imgScale.value *= factor
  draw()
}

function zoomIn() {
  imgX.value = CANVAS_W / 2 + (imgX.value - CANVAS_W / 2) * 1.1
  imgY.value = CANVAS_H / 2 + (imgY.value - CANVAS_H / 2) * 1.1
  imgScale.value *= 1.1; draw()
}
function zoomOut() {
  imgX.value = CANVAS_W / 2 + (imgX.value - CANVAS_W / 2) * 0.9
  imgY.value = CANVAS_H / 2 + (imgY.value - CANVAS_H / 2) * 0.9
  imgScale.value *= 0.9; draw()
}

// ── Crop & upload ─────────────────────────────────────────
async function cropAndUpload() {
  const img = imgEl.value
  if (!img) return
  uploading.value = true
  errorMsg.value = ''

  try {
    // Draw only the crop region onto a new canvas
    const out = document.createElement('canvas')
    out.width = cropW.value
    out.height = cropH.value
    const ctx = out.getContext('2d')!
    ctx.drawImage(
      img,
      (cropX.value - imgX.value) / imgScale.value,
      (cropY.value - imgY.value) / imgScale.value,
      cropW.value / imgScale.value,
      cropH.value / imgScale.value,
      0, 0, cropW.value, cropH.value
    )
    const dataUrl = out.toDataURL('image/jpeg', 0.92)
    const base = customFilename.value.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fff._-]/g, '-').replace(/\.jpg$/i, '')
    const filename = base ? `${base}.jpg` : `inline-${props.slug}-${Date.now()}.jpg`
    const res = await $fetch<{ path: string }>('/api/images/upload', {
      method: 'POST',
      body: { image: dataUrl, filename }
    })
    emit('done', res.path)
    close()
  } catch (err: any) {
    errorMsg.value = err?.data?.message ?? '上傳失敗，請重試'
  } finally {
    uploading.value = false
  }
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      @click.self="close"
    >
      <div class="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full mx-4" style="max-width: 860px">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-sm font-semibold">裁切圖片</h3>
          <button type="button" class="text-neutral-500 hover:text-neutral-300 text-xl leading-none" @click="close">×</button>
        </div>

        <!-- Ratio selector -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-neutral-500 text-xs">比例：</span>
          <button
            v-for="r in RATIOS"
            :key="r.label"
            type="button"
            class="px-3 py-1 text-xs rounded-md border transition-colors"
            :class="selectedRatio === r.value
              ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
              : 'text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-neutral-300'"
            @click="selectedRatio = r.value"
          >
            {{ r.label }}
          </button>
        </div>

        <p class="text-neutral-500 text-xs mb-3">拖曳移動圖片，滾輪縮放；拖曳角落調整裁切範圍。</p>

        <!-- Canvas -->
        <div class="flex justify-center">
          <canvas
            ref="canvasRef"
            :width="CANVAS_W"
            :height="CANVAS_H"
            class="rounded-lg border border-neutral-700 select-none bg-neutral-800"
            style="max-width: 100%"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
            @wheel.prevent="onWheel"
          />
        </div>

        <!-- Hidden file input (triggered on open) -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <!-- Filename input -->
        <div class="flex items-center gap-2 mt-4">
          <label class="text-neutral-500 text-xs shrink-0">檔案名稱：</label>
          <div class="flex items-center flex-1 min-w-0">
            <input
              v-model="customFilename"
              type="text"
              placeholder="留空則自動命名"
              class="flex-1 min-w-0 px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-neutral-500 transition-colors"
            />
            <span class="ml-1.5 text-neutral-600 text-xs shrink-0">.jpg</span>
          </div>
        </div>

        <!-- Zoom + actions -->
        <div class="flex items-center mt-3">
          <div class="flex items-center gap-2">
            <button type="button" class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors" @click="zoomOut">−</button>
            <span class="text-neutral-500 text-xs w-12 text-center">{{ Math.round(imgScale * 100) }}%</span>
            <button type="button" class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors" @click="zoomIn">+</button>
          </div>
          <div class="ml-auto flex items-center gap-3">
            <p v-if="errorMsg" class="text-xs text-rose-400">{{ errorMsg }}</p>
            <button type="button" class="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors" :disabled="uploading" @click="close">取消</button>
            <button
              type="button"
              class="px-5 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              :disabled="uploading || !hasImage"
              @click="cropAndUpload"
            >
              <span v-if="uploading">上傳中…</span>
              <span v-else>裁切並插入</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
