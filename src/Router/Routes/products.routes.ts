import { Router } from 'express'

import { product } from '@controllers'

const ProductsRouter = Router()

ProductsRouter.get('/', product.list)

export default ProductsRouter
