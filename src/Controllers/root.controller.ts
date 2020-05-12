import { Request, Response } from 'express'

import { $response } from '@utils'

function run(_: Request, res: Response): Response {
  return $response.success(res, { success: true })
}

export default { run }
