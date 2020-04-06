import { Request, Response } from 'express'

import { Response as $response } from '@utils'

function run(_: Request, res: Response): Response {
  return $response.success(res, { success: true })
}

export default { run }
