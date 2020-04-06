import { Response, Request } from 'express'
import * as Yup from 'yup'

import { Product } from '@models'
import { $response } from '@utils'

const list = async (_req: Request, res: Response): Promise<Response> => {
  const found = await Product.find({})
  if (!found || found.length < 1) {
    return $response.notFound(res, { error: 'Not found any product' })
  }

  return $response.success(res, found)
}

const create = async (req: Request, res: Response): Promise<Response> => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    tags: Yup.array().of(Yup.string()),
    price: Yup.number().required(),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          required: Yup.boolean().required()
        })
      )
      .min(1)
      .required(),
    additional: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        price: Yup.number().required()
      })
    )
  })

  const { body: payload } = req

  const isSchemaValid = await schema.isValid(payload)
  if (!isSchemaValid) {
    return $response.badRequest(res, {
      error: 'Validation fails. Invalid payload'
    })
  }

  const created = await Product.create(payload)
  return $response.created(res, created)
}

const update = async (req: Request, res: Response): Promise<Response> => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    tags: Yup.array().of(Yup.string()),
    price: Yup.number().required(),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          required: Yup.boolean().required()
        })
      )
      .min(1)
      .required(),
    additional: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        price: Yup.number().required()
      })
    )
  })

  const { body: payload } = req
  const { productId: _id } = req.params

  const isSchemaValid = await schema.isValid(payload)
  if (!isSchemaValid) {
    return $response.badRequest(res, {
      error: 'Validation fails. Invalid payload'
    })
  }

  const found = await Product.findOne({ _id })
  if (!found) {
    return $response.notFound(res, {
      error: 'Product with provided ID not found'
    })
  }

  const updated = await Product.findOneAndUpdate(
    { _id },
    { $set: payload },
    { new: true }
  ).lean()
  return $response.success(res, updated || {})
}

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { productId: _id } = req.params

  const found = await Product.findOne({ _id })
  if (!found) {
    return $response.notFound(res, {
      error: 'Not found any product with provided ID'
    })
  }

  await Product.remove({ _id })
  return $response.success(res, { _id })
}

export default { list, create, update, remove }
