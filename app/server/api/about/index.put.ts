import About from '../../models/About'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let about = await About.findOne()
  if (about) {
    Object.assign(about, body)
    await about.save()
  } else {
    about = await About.create(body)
  }
  const obj = about.toObject()
  return { ...obj, id: obj._id.toString() }
})
