import { Response } from 'express'

const handleError = (
  res: Response,
  status: number,
  error: string | Record<string, any>
): Response => {
  let payload = error
  if (typeof error === 'string') {
    payload = { error }
  }
  return res.status(status).json(payload)
}

// ==> 200
const success = (
  res: Response,
  payload: Record<string, any> | Array<Record<string, any>>
): Response => res.status(200).json(payload)

const created = (
  res: Response,
  payload: Record<string, any> | Array<Record<string, any>>
): Response => res.status(201).json(payload)

// ==> 400
const badRequest = (
  res: Response,
  payload: string | Record<string, any>
): Response => handleError(res, 400, payload)

const unauthorized = (
  res: Response,
  payload: string | Record<string, any>
): Response => handleError(res, 401, payload)

const forbidden = (
  res: Response,
  payload: string | Record<string, any>
): Response => handleError(res, 403, payload)

const notFound = (
  res: Response,
  payload: string | Record<string, any>
): Response => handleError(res, 404, payload)

// ==> 500
const internalError = (res: Response, payload: Record<string, any>): Response =>
  handleError(res, 500, payload)

export default {
  // ==> 200
  success,
  created,

  // ==> 400
  badRequest,
  forbidden,
  notFound,
  unauthorized,

  // ==> 500
  internalError
}
