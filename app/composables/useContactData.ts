export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  receivedAt: string
}

const STORAGE_KEY = 'sam_contacts'

const defaultMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: '林小雨',
    email: 'xiaoyulin@example.com',
    message: '你好！我非常喜歡你的文章《清晨的儀式感》，讓我想起了自己也有這樣的習慣。謝謝你分享這麼美好的文字。',
    read: false,
    receivedAt: '2026-04-01T10:23:00.000Z'
  },
  {
    id: 'msg-2',
    name: 'Tony Chen',
    email: 'tony@example.com',
    message: '請問你有考慮開放訂閱通知嗎？很希望第一時間看到你的新文章！',
    read: true,
    receivedAt: '2026-03-28T15:40:00.000Z'
  },
  {
    id: 'msg-3',
    name: '無名',
    email: 'anon@example.com',
    message: '書評寫得真好，尤其是那篇 2025 閱讀回顧，我跟著你的書單讀了三本，每一本都很喜歡。',
    read: true,
    receivedAt: '2026-03-15T09:05:00.000Z'
  }
]

export function useContactData() {
  function getAll(): ContactMessage[] {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try { return JSON.parse(raw) } catch {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages))
    }
    return defaultMessages
  }

  function markRead(id: string): void {
    const messages = getAll()
    const msg = messages.find(m => m.id === id)
    if (msg) {
      msg.read = true
      if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }

  function remove(id: string): void {
    const messages = getAll().filter(m => m.id !== id)
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }

  function unreadCount(): number {
    return getAll().filter(m => !m.read).length
  }

  return { getAll, markRead, remove, unreadCount }
}
