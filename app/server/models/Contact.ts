import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  message: string
  read: boolean
  receivedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    receivedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const Contact: Model<IContact> =
  (mongoose.models.Contact as Model<IContact>) || mongoose.model<IContact>('Contact', ContactSchema)

export default Contact
