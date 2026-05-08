import { connectDB } from '../db/index.js'

export default defineEventHandler(async () => {
  await connectDB()
})
