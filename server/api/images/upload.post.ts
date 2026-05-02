import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.image || !body?.filename) {
    throw createError({ statusCode: 400, message: '缺少 image 或 filename' })
  }

  const base64Data = (body.image as string).replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  const imagesDir = join(process.cwd(), 'images')
  await mkdir(imagesDir, { recursive: true })

  const filename = (body.filename as string).replace(/[^a-zA-Z0-9._-]/g, '-')
  await writeFile(join(imagesDir, filename), buffer)

  return { path: `/images/${filename}` }
})
