import Contact from '../../../models/Contact'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const contact = await Contact.findByIdAndDelete(id)
  if (!contact) throw createError({ statusCode: 404, message: 'Contact not found' })
  return { success: true }
})
