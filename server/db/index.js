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

  // heartbeatFrequencyMS: 10000 — 每 10 秒 ping 一次 Atlas，讓 Mongoose 能即時偵測到連線已斷，主動重連，不會誤以為 readyState === 1
  // serverSelectionTimeoutMS: 10000 — 選擇可用伺服器的等待上限，避免永久卡住
  // socketTimeoutMS: 30000 — 單次操作的 TCP 逾時，給重連足夠時間
  mongoose.set('strictQuery', true)
  connectionPromise = mongoose.connect(mongodbUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
  }).then(() => {
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
