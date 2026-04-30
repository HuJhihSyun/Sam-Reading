import Article from '~~/server/models/Article'

export default defineEventHandler(async () => {
  try {
    const articles = await Article.find().sort({ updatedAt: -1 }).lean()

    return {
      status: {
        success: true,
        code: 'string',
        message: 'string'
      },
      data: articles.map((a) => ({ ...a, id: a._id.toString() }))
    }
  } catch (err) {
    console.error('[API /api/articles GET]', err)
    throw createError({ statusCode: 500, statusMessage: String(err) })
  }
})
