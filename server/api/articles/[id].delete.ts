import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const article = await Article.findOneAndDelete({ slug })
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })
  return { success: true }
})
