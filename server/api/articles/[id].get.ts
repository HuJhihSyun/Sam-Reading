import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const article = await Article.findOne({ slug }).lean()
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
