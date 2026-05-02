<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string
    slug: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  // ── UI state ──────────────────────────────────────────────
  const fileInput = ref<HTMLInputElement | null>(null)
  const showCropModal = ref(false)
  const uploading = ref(false)
  const errorMsg = ref('')

  // ── Canvas / image state ──────────────────────────────────
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const imgEl = ref<HTMLImageElement | null>(null)

  // position & scale of image on canvas
  const imgX = ref(0)
  const imgY = ref(0)
  const imgScale = ref(1)

  // Drag
  const dragging = ref(false)
  const dragOrigin = ref({ x: 0, y: 0, ix: 0, iy: 0 })

  // Canvas crop output size (16:9)
  const CANVAS_W = 800
  const CANVAS_H = 450

  // ── File selection ────────────────────────────────────────
  function pickFile() {
    errorMsg.value = ''
    fileInput.value?.click()
  }

  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      errorMsg.value = '請選擇圖片檔案'
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      const img = new Image()
      img.onload = () => {
        imgEl.value = img
        // Scale to cover the canvas
        const scaleX = CANVAS_W / img.width
        const scaleY = CANVAS_H / img.height
        imgScale.value = Math.max(scaleX, scaleY)
        imgX.value = (CANVAS_W - img.width * imgScale.value) / 2
        imgY.value = (CANVAS_H - img.height * imgScale.value) / 2
        showCropModal.value = true
        nextTick(draw)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    // Reset so same file can be selected again
    ;(e.target as HTMLInputElement).value = ''
  }

  // ── Canvas drawing ────────────────────────────────────────
  function draw() {
    const canvas = canvasRef.value
    const img = imgEl.value
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.drawImage(img, imgX.value, imgY.value, img.width * imgScale.value, img.height * imgScale.value)
  }

  // ── Drag (mouse) ──────────────────────────────────────────
  function onMouseDown(e: MouseEvent) {
    dragging.value = true
    dragOrigin.value = { x: e.clientX, y: e.clientY, ix: imgX.value, iy: imgY.value }
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.value) return
    imgX.value = dragOrigin.value.ix + (e.clientX - dragOrigin.value.x)
    imgY.value = dragOrigin.value.iy + (e.clientY - dragOrigin.value.y)
    draw()
  }

  function onMouseUp() {
    dragging.value = false
  }

  // ── Drag (touch) ──────────────────────────────────────────
  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    dragging.value = true
    dragOrigin.value = { x: t.clientX, y: t.clientY, ix: imgX.value, iy: imgY.value }
  }

  function onTouchMove(e: TouchEvent) {
    if (!dragging.value) return
    e.preventDefault()
    const t = e.touches[0]
    imgX.value = dragOrigin.value.ix + (t.clientX - dragOrigin.value.x)
    imgY.value = dragOrigin.value.iy + (t.clientY - dragOrigin.value.y)
    draw()
  }

  function onTouchEnd() {
    dragging.value = false
  }

  // ── Zoom ─────────────────────────────────────────────────
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.08 : 0.92
    // Zoom toward cursor position on canvas
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
    imgScale.value *= 1.1
    draw()
  }

  function zoomOut() {
    imgX.value = CANVAS_W / 2 + (imgX.value - CANVAS_W / 2) * 0.9
    imgY.value = CANVAS_H / 2 + (imgY.value - CANVAS_H / 2) * 0.9
    imgScale.value *= 0.9
    draw()
  }

  // ── Crop & upload ─────────────────────────────────────────
  async function cropAndUpload() {
    const canvas = canvasRef.value
    if (!canvas) return
    uploading.value = true
    errorMsg.value = ''

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      const filename = `cover-${props.slug}-${Date.now()}.jpg`
      const res = await $fetch<{ path: string }>('/api/images/upload', {
        method: 'POST',
        body: { image: dataUrl, filename }
      })
      emit('update:modelValue', res.path)
      showCropModal.value = false
    } catch (err: any) {
      errorMsg.value = err?.data?.message ?? '上傳失敗，請重試'
    } finally {
      uploading.value = false
    }
  }

  function closeCropModal() {
    if (uploading.value) return
    showCropModal.value = false
  }
</script>

<template>
  <div>
    <!-- Hidden file input -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <!-- Current cover preview + action -->
    <div class="flex flex-col items-start gap-2">
      <!-- Preview box -->
      <div
        class="relative shrink-0 w-full rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center"
      >
        <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" alt="封面圖" />
        <span v-else class="text-neutral-600 text-xs text-center px-2">尚未設定封面</span>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-2 pt-1">
        <div class="flex gap-2">
          <button
            type="button"
            class="px-4 py-2 text-xs bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            @click="pickFile"
          >
            {{ modelValue ? '更換封面' : '上傳封面' }}
          </button>
          <button
            v-if="modelValue"
            type="button"
            class="px-4 py-2 text-xs text-neutral-500 hover:text-rose-400 transition-colors text-left"
            @click="emit('update:modelValue', '')"
          >
            移除封面
          </button>
        </div>
      </div>
    </div>

    <p v-if="errorMsg" class="text-xs text-rose-400 mt-2">{{ errorMsg }}</p>

    <!-- Crop modal overlay -->
    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        @click.self="closeCropModal"
      >
        <div class="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-3xl mx-4">
          <!-- Modal header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white text-sm font-semibold">裁切封面圖片</h3>
            <button
              type="button"
              class="text-neutral-500 hover:text-neutral-300 text-xl leading-none"
              @click="closeCropModal"
            >
              ×
            </button>
          </div>

          <p class="text-neutral-500 text-xs mb-3">拖曳移動圖片，滾輪縮放，調整至合適位置後按下裁切。</p>

          <!-- Canvas -->
          <div class="relative flex justify-center">
            <canvas
              ref="canvasRef"
              :width="CANVAS_W"
              :height="CANVAS_H"
              class="rounded-lg border border-neutral-700 select-none"
              style="max-width: 100%; cursor: grab"
              :style="dragging ? 'cursor: grabbing' : ''"
              @mousedown="onMouseDown"
              @mousemove="onMouseMove"
              @mouseup="onMouseUp"
              @mouseleave="onMouseUp"
              @wheel.prevent="onWheel"
              @touchstart.passive="onTouchStart"
              @touchmove.prevent="onTouchMove"
              @touchend="onTouchEnd"
            />
          </div>

          <!-- Zoom controls -->
          <div class="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-lg flex items-center justify-center transition-colors"
              @click="zoomOut"
            >
              −
            </button>
            <span class="text-neutral-500 text-xs w-12 text-center">{{ Math.round(imgScale * 100) }}%</span>
            <button
              type="button"
              class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-lg flex items-center justify-center transition-colors"
              @click="zoomIn"
            >
              +
            </button>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-5">
            <button
              type="button"
              class="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              :disabled="uploading"
              @click="closeCropModal"
            >
              取消
            </button>
            <button
              type="button"
              class="px-5 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              :disabled="uploading"
              @click="cropAndUpload"
            >
              <span v-if="uploading">上傳中…</span>
              <span v-else>裁切並儲存</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
