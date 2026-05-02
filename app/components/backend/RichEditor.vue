<script setup lang="ts">
  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const editorRef = ref<HTMLDivElement | null>(null)
  const cropperOpen = ref(false)
  let savedRange: Range | null = null

  // Sync inner HTML from modelValue on mount
  onMounted(() => {
    if (editorRef.value && props.modelValue !== editorRef.value.innerHTML) {
      editorRef.value.innerHTML = props.modelValue || ''
    }
  })

  // Update when modelValue changes from outside (e.g. loading article)
  watch(
    () => props.modelValue,
    (val) => {
      if (editorRef.value && val !== editorRef.value.innerHTML) {
        editorRef.value.innerHTML = val || ''
      }
    }
  )

  function onInput() {
    emit('update:modelValue', editorRef.value?.innerHTML ?? '')
  }

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    editorRef.value?.focus()
    onInput()
  }

  function isActive(cmd: string): boolean {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  function insertLink() {
    const url = prompt('輸入連結 URL：', 'https://')
    if (url) exec('createLink', url)
  }

  function insertImageUrl() {
    const url = prompt('輸入圖片 URL：')
    if (url) exec('insertImage', url)
  }

  function saveSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange()
    }
  }

  function restoreSelection() {
    if (!savedRange) return
    const sel = window.getSelection()
    if (sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange)
    }
  }

  function openCropper() {
    saveSelection()
    cropperOpen.value = true
  }

  function onCropDone(path: string) {
    editorRef.value?.focus()
    restoreSelection()
    document.execCommand('insertImage', false, path)
    onInput()
  }

  const tools = [
    { cmd: 'bold', label: 'B', title: '粗體', style: 'font-bold' },
    { cmd: 'italic', label: 'I', title: '斜體', style: 'italic' },
    { cmd: 'underline', label: 'U', title: '底線', style: 'underline' },
    { cmd: 'strikeThrough', label: 'S', title: '刪除線', style: 'line-through' }
  ]
</script>

<template>
  <div class="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-neutral-700 bg-neutral-800/60">
      <!-- Format buttons -->
      <button
        v-for="tool in tools"
        :key="tool.cmd"
        type="button"
        :title="tool.title"
        class="w-7 h-7 rounded text-xs flex items-center justify-center transition-colors"
        :class="
          isActive(tool.cmd)
            ? 'bg-neutral-600 text-white'
            : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
        "
        :style="tool.cmd === 'italic' ? 'font-style:italic' : tool.cmd === 'underline' ? 'text-decoration:underline' : tool.cmd === 'strikeThrough' ? 'text-decoration:line-through' : ''"
        @mousedown.prevent="exec(tool.cmd)"
      >
        {{ tool.label }}
      </button>

      <div class="w-px h-5 bg-neutral-700 mx-1" />

      <!-- Heading -->
      <button type="button" title="H2 標題" class="px-2 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('formatBlock', 'h2')">H2</button>
      <button type="button" title="H3 標題" class="px-2 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('formatBlock', 'h3')">H3</button>
      <button type="button" title="內文段落" class="px-2 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('formatBlock', 'p')">P</button>

      <div class="w-px h-5 bg-neutral-700 mx-1" />

      <!-- Lists -->
      <button type="button" title="無序列表" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('insertUnorderedList')">≡</button>
      <button type="button" title="有序列表" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('insertOrderedList')">1.</button>
      <button type="button" title="引用" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('formatBlock', 'blockquote')">"</button>

      <div class="w-px h-5 bg-neutral-700 mx-1" />

      <!-- Align -->
      <button type="button" title="左對齊" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('justifyLeft')">⬅</button>
      <button type="button" title="置中" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('justifyCenter')">↔</button>

      <div class="w-px h-5 bg-neutral-700 mx-1" />

      <!-- Link & Image -->
      <button type="button" title="插入連結" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="insertLink">🔗</button>
      <button type="button" title="插入圖片 URL" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="insertImageUrl">🖼</button>
      <button type="button" title="上傳並裁切圖片" class="w-7 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors flex items-center justify-center" @mousedown.prevent="openCropper">↑</button>

      <div class="w-px h-5 bg-neutral-700 mx-1" />

      <button type="button" title="清除格式" class="px-2 h-7 rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors" @mousedown.prevent="exec('removeFormat')">清除</button>
    </div>

    <!-- Editable area -->
    <div
      ref="editorRef"
      contenteditable="true"
      class="min-h-72 px-5 py-4 text-sm text-neutral-200 leading-7 outline-none rich-editor-content"
      @input="onInput"
    />
  </div>

  <backend-inline-image-cropper v-model:open="cropperOpen" slug="inline" @done="onCropDone" />
</template>

<style scoped>
.rich-editor-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: #e5e5e5;
}
.rich-editor-content :deep(h3) {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.8rem 0 0.4rem;
  color: #d4d4d4;
}
.rich-editor-content :deep(p) {
  margin: 0.5rem 0;
}
.rich-editor-content :deep(blockquote) {
  border-left: 3px solid #525252;
  padding-left: 1rem;
  color: #a3a3a3;
  margin: 0.5rem 0;
  font-style: italic;
}
.rich-editor-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(a) {
  color: #d4ad98;
  text-decoration: underline;
}
.rich-editor-content :deep(img) {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}
</style>
