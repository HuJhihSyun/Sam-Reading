import Article from '../../models/Article'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '')
    .slice(0, 60)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const slug: string = body.slug || generateSlug(body.title)

  const article = await Article.create({ ...body, slug })
  return { ...article.toObject(), id: article._id.toString() }
})
