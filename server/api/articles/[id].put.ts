import Article from '~~/server/models/Article'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '')
    .slice(0, 60)
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.title && !body.slug) body.slug = generateSlug(body.title)

  const article = await Article.findOneAndUpdate({ slug }, body, { new: true }).lean()
  if (!article) throw createError({ statusCode: 404, message: 'Article not found' })
  return { ...article, id: article._id.toString() }
})
