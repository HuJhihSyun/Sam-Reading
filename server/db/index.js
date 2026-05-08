import mongoose from 'mongoose'

let connectionPromise = null

export async function connectDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) return

  // Reuse in-progress connection (prevents multiple concurrent connects on cold start)
  if (connectionPromise) return connectionPromise

  const config = useRuntimeConfig()
  const mongodbUri = config.mongodbUri

  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not set. Please configure it in your environment variables.')
  }

  mongoose.set('strictQuery', true)
  connectionPromise = mongoose.connect(mongodbUri).then(() => {
    console.log('MongoDB Connected Successfully!')
    connectionPromise = null
  }).catch((e) => {
    console.error('MongoDB connection error:', e)
    connectionPromise = null
    throw e
  })

  return connectionPromise
}

// Keep plugin for local dev / traditional server warm start
export default defineNitroPlugin(async () => {
  try {
    await connectDB()
  } catch (e) {
    console.error('MongoDB plugin init failed:', e)
  }
})
