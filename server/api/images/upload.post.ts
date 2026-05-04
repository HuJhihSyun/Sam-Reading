import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.image || !body?.filename) {
    throw createError({ statusCode: 400, message: '缺少 image 或 filename' })
  }

  const config = useRuntimeConfig(event)
  const r2 = config.cloudflareR2

  if (!r2?.accountId || !r2?.accessKeyId || !r2?.secretAccessKey || !r2?.bucketName) {
    throw createError({ statusCode: 500, message: 'Cloudflare R2 設定不完整' })
  }

  const base64Data = (body.image as string).replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  const filename = (body.filename as string).replace(/[^a-zA-Z0-9._-]/g, '-')
  const key = `covers/${filename}`

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey
    }
  })

  await client.send(
    new PutObjectCommand({
      Bucket: r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg'
    })
  )

  const publicUrl = r2.publicUrl
    ? `${r2.publicUrl}/${key}`
    : `https://${r2.accountId}.r2.cloudflarestorage.com/${r2.bucketName}/${key}`

  return { path: publicUrl }
})
