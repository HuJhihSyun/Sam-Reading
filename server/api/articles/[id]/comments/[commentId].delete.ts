import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const commentId = getRouterParam(event, 'commentId')

  const article = await Article.findOneAndUpdate(
    { slug },
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  ).lean()

  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })

  return { success: true }
})
