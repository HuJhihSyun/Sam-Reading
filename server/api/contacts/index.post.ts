import Contact from '~~/server/models/Contact'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const contact = await Contact.create({
    name: body.name,
    email: body.email,
    message: body.message,
    receivedAt: new Date()
  })
  return { ...contact.toObject(), id: contact._id.toString() }
})
