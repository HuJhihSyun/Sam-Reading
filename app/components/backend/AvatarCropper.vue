<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const imgEl = ref<HTMLImageElement | null>(null)

  const showCropModal = ref(false)
  const uploading = ref(false)
  const errorMsg = ref('')

  const CANVAS_SIZE = 480

  const imgX = ref(0)
  const imgY = ref(0)
  const imgScale = ref(1)

  const dragging = ref(false)
  const dragOrigin = ref({ x: 0, y: 0, ix: 0, iy: 0 })

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
        const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height)
        imgScale.value = scale
        imgX.value = (CANVAS_SIZE - img.width * scale) / 2
        imgY.value = (CANVAS_SIZE - img.height * scale) / 2
        showCropModal.value = true
        nextTick(draw)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    ;(e.target as HTMLInputElement).value = ''
  }

  function draw() {
    const canvas = canvasRef.value
    const img = imgEl.value
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    ctx.drawImage(img, imgX.value, imgY.value, img.width * imgScale.value, img.height * imgScale.value)

    // circular overlay
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // circle border
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.stroke()
  }

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

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.08 : 0.92
    const rect = canvasRef.value!.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE
    const cy = ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE
    imgX.value = cx + (imgX.value - cx) * factor
    imgY.value = cy + (imgY.value - cy) * factor
    imgScale.value *= factor
    draw()
  }

  function zoomIn() {
    const c = CANVAS_SIZE / 2
    imgX.value = c + (imgX.value - c) * 1.1
    imgY.value = c + (imgY.value - c) * 1.1
    imgScale.value *= 1.1
    draw()
  }
  function zoomOut() {
    const c = CANVAS_SIZE / 2
    imgX.value = c + (imgX.value - c) * 0.9
    imgY.value = c + (imgY.value - c) * 0.9
    imgScale.value *= 0.9
    draw()
  }

  async function cropAndUpload() {
    const img = imgEl.value
    if (!img) return
    uploading.value = true
    errorMsg.value = ''

    try {
      // draw circular crop into a square output canvas
      const out = document.createElement('canvas')
      out.width = CANVAS_SIZE
      out.height = CANVAS_SIZE
      const ctx = out.getContext('2d')!
      ctx.beginPath()
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, imgX.value, imgY.value, img.width * imgScale.value, img.height * imgScale.value)

      const dataUrl = out.toDataURL('image/jpeg', 0.92)
      const filename = `avatar-${Date.now()}.jpg`
      const res = await $fetch<{ path: string }>('/api/images/upload', {
        method: 'POST',
        body: { image: dataUrl, filename, folder: 'avatar' }
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
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <div class="flex items-center gap-4">
      <!-- Preview -->
      <div
        class="w-20 h-20 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center shrink-0"
      >
        <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" alt="作者頭像" />
        <span v-else class="text-neutral-600 text-xs text-center px-1">尚未設定</span>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-2">
        <button
          type="button"
          class="px-4 py-2 text-xs bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
          @click="pickFile"
        >
          {{ modelValue ? '更換頭像' : '上傳頭像' }}
        </button>
        <button
          v-if="modelValue"
          type="button"
          class="text-xs text-neutral-500 hover:text-rose-400 transition-colors text-left"
          @click="emit('update:modelValue', '')"
        >
          移除頭像
        </button>
      </div>
    </div>

    <p v-if="errorMsg" class="text-xs text-rose-400 mt-2">{{ errorMsg }}</p>

    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        @click.self="closeCropModal"
      >
        <div class="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-lg mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white text-sm font-semibold">裁切頭像</h3>
            <button
              type="button"
              class="text-neutral-500 hover:text-neutral-300 text-xl leading-none"
              @click="closeCropModal"
            >
              ×
            </button>
          </div>

          <p class="text-neutral-500 text-xs mb-3">拖曳移動圖片，滾輪縮放，調整至圓形範圍內後按下裁切。</p>

          <div class="flex justify-center">
            <canvas
              ref="canvasRef"
              :width="CANVAS_SIZE"
              :height="CANVAS_SIZE"
              class="rounded-lg border border-neutral-700 select-none bg-neutral-800"
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
