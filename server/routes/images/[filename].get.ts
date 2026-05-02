import { readFile } from 'fs/promises'
import { join, extname } from 'path'

const mimeMap: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
}

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  if (!filename || filename.includes('..')) {
    throw createError({ statusCode: 400, message: 'Invalid filename' })
  }

  const filePath = join(process.cwd(), 'images', filename)

  try {
    const buffer = await readFile(filePath)
    const ext = extname(filename).toLowerCase()
    setResponseHeader(event, 'Content-Type', mimeMap[ext] ?? 'application/octet-stream')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return buffer
  } catch {
    throw createError({ statusCode: 404, message: 'Image not found' })
  }
})
