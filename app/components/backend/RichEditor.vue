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
    try {
      return document.queryCommandState(cmd)
    } catch {
      return false
    }
  }

  function insertLink() {
    const sel = window.getSelection()
    const selected = sel && sel.toString().trim()
    if (!selected) {
      const text = prompt('輸入連結文字：')
      if (!text) return
      const url = prompt('輸入連結 URL：', 'https://')
      if (!url) return
      document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`)
      onInput()
      return
    }
    const url = prompt('輸入連結 URL：', 'https://')
    if (url) exec('createLink', url)
  }

  function insertImageUrl() {
    const url = prompt('輸入圖片 URL：')
    if (url) exec('insertImage', url)
  }

  function insertHr() {
    document.execCommand('insertHTML', false, '<hr/>')
    onInput()
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

  const formatTools = [
    { cmd: 'bold', label: 'B', title: '粗體', inlineStyle: 'font-weight:700' },
    { cmd: 'italic', label: 'I', title: '斜體', inlineStyle: 'font-style:italic' },
    { cmd: 'underline', label: 'U', title: '底線', inlineStyle: 'text-decoration:underline' },
    { cmd: 'strikeThrough', label: 'S̶', title: '刪除線', inlineStyle: 'text-decoration:line-through' },
    { cmd: 'superscript', label: 'x²', title: '上標', inlineStyle: 'font-size:0.7em;vertical-align:super' },
    { cmd: 'subscript', label: 'x₂', title: '下標', inlineStyle: 'font-size:0.7em;vertical-align:sub' }
  ]
</script>

<template>
  <div class="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-neutral-700 bg-neutral-800/60">
      <!-- Undo / Redo -->
      <button type="button" title="復原 (Ctrl+Z)" class="tb-btn" @mousedown.prevent="exec('undo')">↩</button>
      <button type="button" title="取消復原 (Ctrl+Y)" class="tb-btn" @mousedown.prevent="exec('redo')">↪</button>

      <div class="tb-sep" />

      <!-- Text format -->
      <button
        v-for="t in formatTools"
        :key="t.cmd"
        type="button"
        :title="t.title"
        class="tb-btn"
        :class="isActive(t.cmd) ? 'bg-neutral-600 text-white' : ''"
        :style="t.inlineStyle"
        @mousedown.prevent="exec(t.cmd)"
      >
        {{ t.label }}
      </button>

      <div class="tb-sep" />

      <!-- Headings -->
      <button
        type="button"
        title="H1 大標題"
        class="tb-btn tb-wide"
        :class="{ 'bg-neutral-600 text-white': isActive('formatBlock') }"
        @mousedown.prevent="exec('formatBlock', 'h1')"
      >
        <span style="font-size: 0.85em; font-weight: 700">H1</span>
      </button>
      <button type="button" title="H2 標題" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'h2')">
        <span style="font-size: 0.8em; font-weight: 700">H2</span>
      </button>
      <button type="button" title="H3 小標題" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'h3')">
        <span style="font-size: 0.75em; font-weight: 600">H3</span>
      </button>
      <button type="button" title="H4 細標題" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'h4')">
        <span style="font-size: 0.7em; font-weight: 600">H4</span>
      </button>
      <button type="button" title="H5 最小標題" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'h5')">
        <span style="font-size: 0.65em; font-weight: 500">H5</span>
      </button>
      <button type="button" title="H6 標註標題" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'h6')">
        <span style="font-size: 0.6em; font-weight: 500">H6</span>
      </button>
      <button type="button" title="內文段落" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'p')">
        <span style="font-size: 0.75em">¶ P</span>
      </button>
      <button type="button" title="程式碼區塊" class="tb-btn tb-wide" @mousedown.prevent="exec('formatBlock', 'pre')">
        <span style="font-family: monospace; font-size: 0.75em">&lt;/&gt;</span>
      </button>

      <div class="tb-sep" />

      <!-- Lists & indent -->
      <button type="button" title="無序列表" class="tb-btn" @mousedown.prevent="exec('insertUnorderedList')">≡</button>
      <button type="button" title="有序列表" class="tb-btn" @mousedown.prevent="exec('insertOrderedList')">1.</button>
      <button type="button" title="增加縮排" class="tb-btn" @mousedown.prevent="exec('indent')">⇥</button>
      <button type="button" title="減少縮排" class="tb-btn" @mousedown.prevent="exec('outdent')">⇤</button>

      <div class="tb-sep" />

      <!-- Block elements -->
      <button type="button" title="引用區塊" class="tb-btn" @mousedown.prevent="exec('formatBlock', 'blockquote')">
        "
      </button>
      <button type="button" title="插入水平線" class="tb-btn" @mousedown.prevent="insertHr">—</button>

      <div class="tb-sep" />

      <!-- Alignment -->
      <button type="button" title="靠左對齊" class="tb-btn" @mousedown.prevent="exec('justifyLeft')">⫷</button>
      <button type="button" title="置中對齊" class="tb-btn" @mousedown.prevent="exec('justifyCenter')">≡</button>
      <button type="button" title="靠右對齊" class="tb-btn" @mousedown.prevent="exec('justifyRight')">⫸</button>
      <button type="button" title="左右對齊" class="tb-btn" @mousedown.prevent="exec('justifyFull')">☰</button>

      <div class="tb-sep" />

      <!-- Link & image -->
      <button type="button" title="插入連結" class="tb-btn" @mousedown.prevent="insertLink">🔗</button>
      <button type="button" title="移除連結" class="tb-btn" @mousedown.prevent="exec('unlink')">
        <span style="text-decoration: line-through; font-size: 0.85em">🔗</span>
      </button>
      <button type="button" title="插入圖片 URL" class="tb-btn" @mousedown.prevent="insertImageUrl">🖼</button>
      <button type="button" title="上傳並裁切圖片" class="tb-btn" @mousedown.prevent="openCropper">⬆</button>

      <div class="tb-sep" />

      <!-- Clear -->
      <button type="button" title="清除格式" class="tb-btn tb-wide" @mousedown.prevent="exec('removeFormat')">
        <span style="font-size: 0.75em">清除</span>
      </button>
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
  .tb-btn {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s, color 0.15s;
    color: #a3a3a3;
  }
  .tb-btn:hover {
    background-color: #404040;
    color: #ffffff;
  }
  .tb-wide {
    width: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .tb-sep {
    width: 1px;
    height: 1.25rem;
    background-color: #404040;
    margin-left: 0.125rem;
    margin-right: 0.125rem;
  }

  .rich-editor-content :deep(h1) {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 1.2rem 0 0.6rem;
    color: #f5f5f5;
  }
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
  .rich-editor-content :deep(h4) {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0.6rem 0 0.3rem;
    color: #c4c4c4;
    letter-spacing: 0.03em;
  }
  .rich-editor-content :deep(h5) {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0.5rem 0 0.25rem;
    color: #b5b5b5;
    letter-spacing: 0.04em;
  }
  .rich-editor-content :deep(h6) {
    font-size: 0.75rem;
    font-weight: 500;
    margin: 0.4rem 0 0.2rem;
    color: #a3a3a3;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .rich-editor-content :deep(p) {
    margin: 0.5rem 0;
  }
  .rich-editor-content :deep(blockquote) {
    border-left: 3px solid #525252;
    padding-left: 1rem;
    color: #a3a3a3;
    margin: 0.75rem 0;
    font-style: italic;
  }
  .rich-editor-content :deep(pre) {
    background: #1a1a1a;
    border: 1px solid #3a3a3a;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    font-family: ui-monospace, 'Cascadia Code', monospace;
    font-size: 0.8rem;
    color: #a3e635;
    margin: 0.75rem 0;
    white-space: pre-wrap;
    overflow-x: auto;
  }
  .rich-editor-content :deep(hr) {
    border: none;
    border-top: 1px solid #404040;
    margin: 1.25rem 0;
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
  .rich-editor-content :deep(sup) {
    font-size: 0.7em;
    vertical-align: super;
  }
  .rich-editor-content :deep(sub) {
    font-size: 0.7em;
    vertical-align: sub;
  }
</style>
