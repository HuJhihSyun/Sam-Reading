import Article from '../../models/Article'

export default defineEventHandler(async () => {
  const articles = await Article.find().sort({ updatedAt: -1 }).lean()
  return articles.map((a) => ({ ...a, id: a._id.toString() }))
})
