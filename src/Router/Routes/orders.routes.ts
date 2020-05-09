import { Router } from 'express'

import { order } from '@controllers'

const OrdersRouter = Router()

OrdersRouter.post('/', order.create)

export default OrdersRouter
