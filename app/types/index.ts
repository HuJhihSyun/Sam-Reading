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
  readTime?: number | string
}

export type ArticlePayload = Omit<Article, 'id' | 'readTime'>

export interface ContactMessageInput {
  name: string
  email: string
  message: string
}

export interface ContactMessage extends ContactMessageInput {
  id: string
  read: boolean
  receivedAt: string
}

export interface AboutData {
  name: string
  message: string
  messageEn: string
  infoCards: {
    label: string
    value: string
  }[]
  interests: string[]
  updatedAt?: string
}
