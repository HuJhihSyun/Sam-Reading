import Contact from '../../../models/Contact.js'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const contact = await Contact.findByIdAndUpdate(id, body, { new: true }).lean()
  if (!contact) throw createError({ statusCode: 404, message: 'Contact not found' })
  return { ...contact, id: contact._id.toString() }
})
