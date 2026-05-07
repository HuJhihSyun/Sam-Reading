import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const commentId = getRouterParam(event, 'commentId')
  const body = await readBody(event)

  const article = await Article.findOneAndUpdate(
    { slug, 'comments._id': commentId },
    { $set: { 'comments.$.visible': body.visible } },
    { new: true, projection: { comments: 1 } }
  ).lean()

  if (!article) throw createError({ statusCode: 404, message: 'Comment not found' })

  const updated = (article.comments as any[]).find((c: any) => c._id.toString() === commentId)
  return {
    data: {
      id: updated._id.toString(),
      name: updated.name,
      content: updated.content,
      visible: updated.visible,
      createdAt: updated.createdAt
    }
  }
})
