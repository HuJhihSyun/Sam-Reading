import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment {
  name: string
  content: string
  createdAt: Date
}

export interface IArticle extends Document {
  title: string
  slug: string
  publishDate: string
  tags: string[]
  excerpt: string
  content: string
  status: 'draft' | 'published'
  coverImage?: string
  views: number
  comments: IComment[]
}

const CommentSchema = new Schema<IComment>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
)

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    publishDate: { type: String, required: true },
    tags: { type: [String], default: [] },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    coverImage: { type: String, default: '' },
    views: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] }
  },
  { timestamps: true }
)

const Article: Model<IArticle> =
  (mongoose.models.Article as Model<IArticle>) || mongoose.model<IArticle>('Article', ArticleSchema)

export default Article
