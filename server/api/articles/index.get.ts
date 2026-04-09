import Article from '~~/server/models/Article'

export default defineEventHandler(async () => {
  const articles = await Article.find().sort({ updatedAt: -1 }).lean()

  return {
    status: {
      success: true,
      code: 'string',
      message: 'string'
    },
    data: articles.map((a) => ({ ...a, id: a._id.toString() }))
  }
})
