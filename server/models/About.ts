import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IInfoCard {
  label: string
  value: string
}

export interface IAbout extends Document {
  name: string
  avatar: string
  message: string
  messageEn: string
  infoCards: IInfoCard[]
  interests: string[]
}

const InfoCardSchema = new Schema<IInfoCard>({ label: String, value: String }, { _id: false })

const AboutSchema = new Schema<IAbout>(
  {
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    message: { type: String, default: '' },
    messageEn: { type: String, default: '' },
    infoCards: { type: [InfoCardSchema], default: [] },
    interests: { type: [String], default: [] }
  },
  { timestamps: true }
)

const About: Model<IAbout> = (mongoose.models.About as Model<IAbout>) || mongoose.model<IAbout>('About', AboutSchema)

export default About
