export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id: string
  title: string
  slug: string
  publishDate: string
  tags: string[]
  excerpt: string
  content: string
  status: ArticleStatus
  coverImage?: string
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

export interface AboutInfoCard {
  label: string
  value: string
}

export interface AboutData {
  name: string
  message: string
  messageEn: string
  infoCards: AboutInfoCard[]
  interests: string[]
  updatedAt?: string
}

export interface SiteConfig {
  name: string
  shortName: string
  description: string
  url: string
  author: string
  locale: string
  titleSeparator: string
  ogImage: string
  contactEmail?: string
  instagramUrl?: string
}
