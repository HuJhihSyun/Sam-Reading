import Article from '../../../models/Article'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const article = await Article.findById(id).lean()
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })
  return { ...article, id: article._id.toString() }
})
