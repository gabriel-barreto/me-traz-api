import Mongoose, { Schema } from 'mongoose'

const AdditionalSchema = new Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true }
})

const model = Mongoose.model('Additional', AdditionalSchema, 'additionals')

export default model
