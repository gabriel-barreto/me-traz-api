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

interface OrderType extends Document {
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
  items: Array<OrderItemType>
}

const OrderPaymentSchema = new Schema(
  {
    type: { type: String, required: true },
    change: { type: Number, required: false }
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

const OrderSchema = new Schema(
  {
    delivery: DeliveryOrderSchema,
    user: UserOrderSchema,
    payment: OrderPaymentSchema,
    items: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        }
      ],
      required: true,
      minlength: 1
    }
  },
  { timestamps: true }
)

const model = Mongoose.model<OrderType>('Order', OrderSchema, 'orders')

export default model