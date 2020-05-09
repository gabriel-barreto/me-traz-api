import { Request, Response } from 'express'
import * as Yup from 'yup'

import { Order } from '@models'
import { $response } from '@utils'

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  whatsapp: Yup.string().required(),
  deliveryType: Yup.string().oneOf(['withdraw', 'delivery']),
  cep: Yup.string().required(),
  number: Yup.number().required(),
  complement: Yup.string().required(),
  paymentType: Yup.string().required(),
  paymentChange: Yup.number().required(),
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
  )
})

async function create(req: Request, res: Response) {
  const { body } = req

  const isSchemaValid = await schema.validate(body)
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
      type: body.paymentType,
      change: body.paymentChange
    },
    user: {
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp
    },
    items: body.items
  }
  const created = await Order.create(payload)

  return $response.created(res, created)
}

export default { create }
