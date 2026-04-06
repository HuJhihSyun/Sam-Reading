export interface Article {
  id: string
  title: string
  slug: string
  publishDate: string
  tags: string[]
  excerpt: string
  content: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'sam_articles'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '')
    .slice(0, 60)
}

const defaultArticles: Article[] = [
  {
    id: 'article-1',
    title: '清晨的儀式感',
    slug: 'morning-rituals',
    publishDate: '2026-03-20',
    tags: ['生活', '日常'],
    excerpt: '每天清晨，我都會給自己留出一段靜謐的時光。泡一杯熱茶，翻開日記，讓思緒在文字間慢慢甦醒。',
    content: '<p>每天清晨，我都會給自己留出一段靜謐的時光。泡一杯熱茶，翻開日記，讓思緒在文字間慢慢甦醒。</p><p>這樣的儀式感，是我給自己最好的禮物。</p>',
    status: 'published',
    createdAt: '2026-03-20T08:00:00.000Z',
    updatedAt: '2026-03-20T08:00:00.000Z'
  },
  {
    id: 'article-2',
    title: '2025 年閱讀回顧',
    slug: 'reading-notes-2025',
    publishDate: '2026-01-01',
    tags: ['閱讀', '書單'],
    excerpt: '這一年讀了三十二本書，有些讓我落淚，有些讓我重新思考生活的方式，每一本都留下了痕跡。',
    content: '<p>這一年讀了三十二本書，有些讓我落淚，有些讓我重新思考生活的方式，每一本都留下了痕跡。</p>',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'article-3',
    title: '微小而確實的幸福',
    slug: 'small-pleasures',
    publishDate: '2025-09-15',
    tags: ['生活', '感悟'],
    excerpt: '新買的筆記本第一頁、剛沖好的咖啡、窗外突然放晴的天空——幸福原來這麼輕，輕到幾乎不需要理由。',
    content: '<p>新買的筆記本第一頁、剛沖好的咖啡、窗外突然放晴的天空——幸福原來這麼輕，輕到幾乎不需要理由。</p>',
    status: 'published',
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-15T00:00:00.000Z'
  }
]

export function useArticleData() {
  function getAll(): Article[] {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try { return JSON.parse(raw) } catch {}
      }
      // Seed defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles))
    }
    return defaultArticles
  }

  function getById(id: string): Article | undefined {
    return getAll().find(a => a.id === id)
  }

  function create(data: Omit<Article, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Article {
    const articles = getAll()
    const now = new Date().toISOString()
    const article: Article = {
      ...data,
      id: generateId(),
      slug: generateSlug(data.title),
      createdAt: now,
      updatedAt: now
    }
    articles.unshift(article)
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    return article
  }

  function update(id: string, data: Partial<Omit<Article, 'id' | 'createdAt'>>): Article | null {
    const articles = getAll()
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return null
    const updated: Article = {
      ...articles[idx],
      ...data,
      id: articles[idx].id,
      createdAt: articles[idx].createdAt,
      updatedAt: new Date().toISOString()
    }
    if (data.title && !data.slug) updated.slug = generateSlug(data.title)
    articles[idx] = updated
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    return updated
  }

  function remove(id: string): boolean {
    const articles = getAll()
    const filtered = articles.filter(a => a.id !== id)
    if (filtered.length === articles.length) return false
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  }

  return { getAll, getById, create, update, remove }
}
