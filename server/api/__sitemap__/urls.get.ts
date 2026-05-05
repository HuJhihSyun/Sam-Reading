import Article from '~~/server/models/Article'

const STATIC_PAGES = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/about', priority: 0.8, changefreq: 'monthly' },
  { loc: '/articles', priority: 0.9, changefreq: 'daily' },
  { loc: '/favorites', priority: 0.6, changefreq: 'monthly' },
  { loc: '/contact', priority: 0.5, changefreq: 'yearly' }
]

export default defineSitemapEventHandler(async () => {
  const articles = await Article.find({ status: 'published' }, 'slug updatedAt').lean()

  const articleUrls = articles.map((article) => ({
    loc: `/articles/${article.slug}`,
    lastmod: article.updatedAt,
    priority: 0.8,
    changefreq: 'monthly'
  }))

  return [...STATIC_PAGES, ...articleUrls]
})
