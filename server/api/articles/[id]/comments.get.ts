import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')

  const article = await Article.findOne({ slug }, { comments: 1 }).lean()
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })

  const comments = (article.comments ?? []).map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    content: c.content,
    visible: c.visible ?? true,
    createdAt: c.createdAt
  }))

  return { data: comments }
})
