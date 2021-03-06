import { Request, Response } from 'express'
import * as Yup from 'yup'

import { OrderMessage } from '@functions'
import { Order } from '@models'
import { $response } from '@utils'

const addressField = (
  type: Yup.StringSchema | Yup.NumberSchema = Yup.string()
) =>
  type.when('deliveryType', (ref: string, schema: Yup.StringSchema) =>
    ref === 'delivery' ? schema.required() : schema
  )
const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  whatsapp: Yup.string().required(),
  deliveryType: Yup.string().oneOf(['withdraw', 'delivery']),
  cep: addressField(),
  number: addressField(Yup.number()),
  complement: Yup.string(),
  paymentMethod: addressField(),
  paymentChange: Yup.number().when(
    'paymentMethod',
    (ref: string, schema: Yup.StringSchema) =>
      ref === 'Dinheiro' ? schema.required() : schema
  ),
  items: Yup.array().of(
    Yup.object().shape({
      additional: Yup.array().of(
        Yup.object().shape({
          item: Yup.string(),
          qtt: Yup.string()
        })
      ),
      ingredients: Yup.array().of(Yup.string()),
      item: Yup.string().required(),
      qtt: Yup.number().required()
    })
  ),
  userAgent: Yup.string().required()
})

async function create(req: Request, res: Response) {
  const { body } = req

  const isSchemaValid = await schema.isValid(body)
  if (!isSchemaValid) {
    return $response.badRequest(res, {
      error: 'Validation fails. Invalid payload'
    })
  }

  const payload = {
    delivery: {
      type: body.deliveryType,
      cep: body.cep,
      number: body.number,
      complement: body.complement
    },
    payment: {
      change: body.paymentChange,
      method: body.paymentMethod
    },
    user: {
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp
    },
    items: body.items
  }
  const { _id } = await Order.create(payload)
  const order = await Order.findOne({ _id }).populate('items.item')

  const { userAgent } = body
  const whatsAppLink = await OrderMessage.build({ order, userAgent })
  return $response.created(res, { callback: whatsAppLink })
}

export default { create }
