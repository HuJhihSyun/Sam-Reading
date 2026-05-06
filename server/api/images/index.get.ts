import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import Article from '~~/server/models/Article'
import About from '~~/server/models/About'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const r2 = config.cloudflareR2

  if (!r2?.accountId || !r2?.accessKeyId || !r2?.secretAccessKey || !r2?.bucketName) {
    throw createError({ statusCode: 500, message: 'Cloudflare R2 設定不完整' })
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey
    }
  })

  const publicUrl = (r2.publicUrl as string).replace(/\/$/, '')

  // Collect all R2 objects (handle pagination)
  const objects: { key: string; size: number; lastModified: string }[] = []
  let continuationToken: string | undefined

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: r2.bucketName,
        ContinuationToken: continuationToken
      })
    )
    for (const obj of res.Contents ?? []) {
      if (obj.Key) {
        objects.push({
          key: obj.Key,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified?.toISOString() ?? ''
        })
      }
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (continuationToken)

  // Fetch articles and about for usage detection
  const [articles, about] = await Promise.all([
    Article.find({}, 'title slug coverImage content').lean(),
    About.findOne({}, 'avatar').lean()
  ])

  // Helper: convert public URL → R2 key
  const urlToKey = (url: string): string | null => {
    if (!url) return null
    const prefix = publicUrl + '/'
    return url.startsWith(prefix) ? url.slice(prefix.length) : null
  }

  type Usage = { type: 'cover' | 'inline' | 'avatar'; title: string; slug?: string }
  const usageMap = new Map<string, Usage[]>()

  const addUsage = (key: string, usage: Usage) => {
    if (!usageMap.has(key)) usageMap.set(key, [])
    usageMap.get(key)!.push(usage)
  }

  for (const article of articles as any[]) {
    if (article.coverImage) {
      const key = urlToKey(article.coverImage)
      if (key) addUsage(key, { type: 'cover', title: article.title, slug: article.slug })
    }
    if (article.content) {
      const imgRegex = /src="([^"]+)"/g
      let match
      while ((match = imgRegex.exec(article.content)) !== null) {
        const key = urlToKey(match[1])
        if (key) addUsage(key, { type: 'inline', title: article.title, slug: article.slug })
      }
    }
  }

  if ((about as any)?.avatar) {
    const key = urlToKey((about as any).avatar)
    if (key) addUsage(key, { type: 'avatar', title: '關於作者頭像' })
  }

  const data = objects.map((obj) => ({
    key: obj.key,
    url: `${publicUrl}/${obj.key}`,
    size: obj.size,
    lastModified: obj.lastModified,
    usedIn: usageMap.get(obj.key) ?? []
  }))

  return { data }
})
