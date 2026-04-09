import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const article = await Article.findByIdAndDelete(id)
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })
  return { success: true }
})
