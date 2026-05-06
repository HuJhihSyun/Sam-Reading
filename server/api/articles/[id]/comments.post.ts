import Article from '~~/server/models/Article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const body = await readBody(event)

  const name = (body?.name || '').trim()
  const content = (body?.content || '').trim()

  if (!name || !content) {
    throw createError({ statusCode: 400, message: 'Name and content are required' })
  }

  const comment = { name, content, createdAt: new Date() }

  const updated = await Article.findOneAndUpdate(
    { slug },
    { $push: { comments: comment } },
    { new: true, projection: { comments: { $slice: -100 } } }
  ).lean()

  if (!updated) throw createError({ statusCode: 404, message: 'Article not found' })

  const saved = updated.comments[updated.comments.length - 1]
  return { comment: saved }
})
