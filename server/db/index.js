import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const mongodbUri = config.mongodbUri

  if (!mongodbUri) {
    console.warn('MongoDB URI is missing. Please set `NUXT_MONGODB_URI` in your `.env` file.')
    return
  }

  if (mongoose.connection.readyState === 1) return

  try {
    mongoose.set('strictQuery', true)
    console.log('MongoDB Connecting...')
    await mongoose.connect(mongodbUri)
    console.log('MongoDB Connected Successfully!')
  } catch (e) {
    console.error('Error MongoDB =>', e)
  }
})
