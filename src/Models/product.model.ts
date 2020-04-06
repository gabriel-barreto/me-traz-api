import Mongoose, { Schema, Document } from 'mongoose'

interface ProductType extends Document {
  title: string
  tag: Array<string>
  description: string
  ingredients: Array<Record<string, any>>
  additional: Array<Record<string, any>>
  photo: Record<string, string>
  price: number
  createdAt: Date
  updateAt: Date
}

const additionalSchema = new Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
)

const ingredientsSchema = new Schema(
  {
    label: { type: String, required: true },
    required: { type: Boolean, required: false, default: (): boolean => false }
  },
  { _id: false }
)

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    tags: { type: [String], required: false, default: [] },
    description: { type: String, required: true },
    ingredients: { type: [ingredientsSchema], minlength: 1, required: true },
    additional: { type: [additionalSchema], required: false, default: [] },
    price: { type: Number, required: true },
    photo: {
      originalname: { type: String, required: true },
      url: { type: String, required: true },
      key: { type: String, required: true }
    }
  },
  { timestamps: true }
)

const model = Mongoose.model<ProductType>('Product', productSchema, 'products')

export default model
