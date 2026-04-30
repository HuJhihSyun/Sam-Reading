import Article from '~~/server/models/Article'

export default defineSitemapEventHandler(async () => {
  const articles = await Article.find({ status: 'published' }, 'slug updatedAt').lean()

  return articles.map((article) => ({
    loc: `/articles/${article.slug}`,
    lastmod: article.updatedAt
  }))
})
