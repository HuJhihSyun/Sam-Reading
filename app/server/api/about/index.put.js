import About from '../../models/About.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Upsert the single About document
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
