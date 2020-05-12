import Mongoose, { Schema, Document } from 'mongoose'

const additionalSchema = {
  type: Schema.Types.ObjectId,
  ref: 'Additional'
}

const ingredientsSchema = new Schema(
  {
    label: { type: String, required: true },
    required: { type: Boolean, required: false, default: (): boolean => false }
  },
  { _id: false }
)

interface IngredientsType {
  label: string
  required: boolean
}

export interface ProductType extends Document {
  title: string
  tag: Array<string>
  description: string
  ingredients: Array<IngredientsType>
  additional: Array<string>
  photo: Record<string, string>
  price: number
  createdAt: Date
  updateAt: Date
}

const productSchema = new Schema(
  {
    active: { type: Boolean, required: false, default: true },
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
