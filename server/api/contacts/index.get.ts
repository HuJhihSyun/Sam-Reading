import Contact from '~~/server/models/Contact'

export default defineEventHandler(async () => {
  const contacts = await Contact.find().sort({ receivedAt: -1 }).lean()

  return {
    status: {
      success: true,
      code: 'string',
      message: 'string'
    },
    data: contacts.map((c) => ({ ...c, id: c._id.toString() }))
  }
})
