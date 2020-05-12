import { Router as ExpressRouter } from 'express'

import * as Routes from './Routes'

const Router = ExpressRouter()

Router.use('/', Routes.root)
Router.use('/orders', Routes.orders)
Router.use('/products', Routes.products)

export default Router
