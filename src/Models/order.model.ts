import Mongoose, { Document, Schema } from 'mongoose'

interface OrderItemAdditionalType {
  item: Schema.Types.ObjectId
  qtt: number
}

interface OrderItemType {
  item: Schema.Types.ObjectId
  additionals?: Array<OrderItemAdditionalType>
  ingredients?: Array<string>
  qtt: number
}

export interface OrderType extends Document {
  delivery: {
    type: string
    cep?: string
    number?: string
    complement?: string
  }
  user: {
    name: string
    email: string
    whatsapp: string
  }
  payment: {
    change?: string
    method: string
  }
}

const OrderPaymentSchema = new Schema(
  {
    change: { type: Number, required: false },
    method: { type: String, required: true }
  },
  { _id: false }
)

const UserOrderSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true }
  },
  { _id: false }
)

const DeliveryOrderSchema = new Schema(
  {
    type: { type: String, required: true, enum: ['withdraw', 'delivery'] },
    cep: { type: String, required: false },
    number: { type: Number, required: false },
    complement: { type: String, required: false }
  },
  { _id: false }
)

const AdditionalSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Additional', required: true },
  qtt: { type: Number, required: true, default: 1 }
})

const ItemOrderSchema = new Schema(
  {
    additionals: { type: [AdditionalSchema], required: false, default: [] },
    ingredients: { type: [String], required: false, default: [] },
    item: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    qtt: { type: Number, required: true, default: 1 }
  },
  { _id: false }
)

const OrderSchema = new Schema(
  {
    delivery: DeliveryOrderSchema,
    user: UserOrderSchema,
    payment: OrderPaymentSchema,
    items: { type: [ItemOrderSchema], required: true, minlength: 1 }
  },
  { timestamps: true }
)

interface OrderModelType extends OrderType {
  items: Array<OrderItemType>
}
const model = Mongoose.model<OrderModelType>('Order', OrderSchema, 'orders')

export default model
