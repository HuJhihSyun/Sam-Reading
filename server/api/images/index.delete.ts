import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.key) {
    throw createError({ statusCode: 400, message: '缺少 key' })
  }

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

  await client.send(new DeleteObjectCommand({ Bucket: r2.bucketName, Key: body.key }))

  return { success: true }
})
