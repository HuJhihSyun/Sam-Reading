import type { Article } from '@/types'

export function useSchemas() {
  const { siteUrl, siteName, siteShortName, author, ogImage } = useSiteConfig()

  function applySchema(schema: object) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  function applyWebsiteSchema() {
    applySchema({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      alternateName: siteShortName,
      url: siteUrl,
      description: '珊珊書評是 Samantha 的個人書寫空間，記錄閱讀感悟、生活片段與日常中值得被留下的每一刻。',
      inLanguage: 'zh-Hant-TW',
      author: {
        '@type': 'Person',
        name: author,
        url: `${siteUrl}/about`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/articles?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    })
  }

  function applyPersonSchema() {
    applySchema({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author,
      url: `${siteUrl}/about`,
      sameAs: ['https://www.instagram.com/sam_readingtw/'],
      worksFor: {
        '@type': 'Organization',
        name: siteName
      }
    })
  }

  function applyBlogPostingSchema(article: Article) {
    applySchema({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt || '',
      url: `${siteUrl}/articles/${article.slug}`,
      datePublished: article.publishDate,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: author,
        url: `${siteUrl}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.svg`
        }
      },
      image: article.coverImage
        ? {
            '@type': 'ImageObject',
            url: article.coverImage
          }
        : {
            '@type': 'ImageObject',
            url: `${siteUrl}${ogImage}`
          },
      keywords: article.tags.join(', '),
      inLanguage: 'zh-Hant-TW',
      isPartOf: {
        '@type': 'Blog',
        name: siteName,
        url: `${siteUrl}/articles`
      }
    })
  }

  function applyBreadcrumbSchema(items: { name: string; path: string }[]) {
    applySchema({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.path}`
      }))
    })
  }

  return {
    applyWebsiteSchema,
    applyPersonSchema,
    applyBlogPostingSchema,
    applyBreadcrumbSchema
  }
}
