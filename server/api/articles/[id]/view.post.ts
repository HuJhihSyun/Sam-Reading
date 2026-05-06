import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')

  const updated = await Article.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true, projection: { views: 1 } }
  ).lean()

  if (!updated) throw createError({ statusCode: 404, message: 'Article not found' })

  return { views: updated.views }
})
