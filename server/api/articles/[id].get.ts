import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const { status } = getQuery(event)
  const filter: Record<string, unknown> = { slug }
  if (status) filter.status = status
  const article = await Article.findOne(filter).lean()
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })

  return {
    status: {
      success: true,
      code: 'string',
      message: 'string'
    },
    data: { ...article, id: article._id.toString() }
  }
})
