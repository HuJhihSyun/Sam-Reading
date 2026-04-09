import Contact from '~~/server/models/Contact'

export default defineEventHandler(async () => {
  const contacts = await Contact.find().sort({ receivedAt: -1 }).lean()
  return contacts.map((c) => ({ ...c, id: c._id.toString() }))
})
