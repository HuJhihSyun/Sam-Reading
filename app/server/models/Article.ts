import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IArticle extends Document {
  title: string
  slug: string
  publishDate: string
  tags: string[]
  excerpt: string
  content: string
  status: 'draft' | 'published'
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    publishDate: { type: String, required: true },
    tags: { type: [String], default: [] },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
)

const Article: Model<IArticle> =
  (mongoose.models.Article as Model<IArticle>) || mongoose.model<IArticle>('Article', ArticleSchema)

export default Article
