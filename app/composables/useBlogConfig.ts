import type { SiteConfig } from '@/types'

export function useBlogConfig() {
  const config = useRuntimeConfig()
  const site = config.public.site as SiteConfig

  const siteName = site.name
  const siteShortName = site.shortName || site.name
  const defaultDescription = site.description
  const siteUrl = site.url
  const author = site.author
  const ogImage = site.ogImage
  const titleSeparator = site.titleSeparator || '—'

  const buildPageTitle = (pageTitle?: string) => {
    if (!pageTitle) return siteName
    return `${pageTitle} ${titleSeparator} ${siteShortName}`
  }

  return {
    site,
    siteName,
    siteShortName,
    defaultDescription,
    siteUrl,
    author,
    ogImage,
    buildPageTitle
  }
}
